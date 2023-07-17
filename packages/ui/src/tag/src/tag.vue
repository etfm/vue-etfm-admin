<template>
  <span
    v-if="disableTransitions"
    :class="containerKls"
    :style="{ backgroundColor: color }"
    @click="handleClick"
  >
    <span :class="ns.e('content')">
      <slot />
    </span>
    <etfma-icon v-if="closable" :class="ns.e('close')" @click.stop="handleClose">
      <Close />
    </etfma-icon>
  </span>
  <transition v-else :name="`${ns.namespace.value}-zoom-in-center`" appear>
    <span :class="containerKls" :style="{ backgroundColor: color }" @click="handleClick">
      <span :class="ns.e('content')">
        <slot />
      </span>
      <etfma-icon v-if="closable" :class="ns.e('close')" @click.stop="handleClose">
        <Close />
      </etfma-icon>
    </span>
  </transition>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import EtfmaIcon from '../../icon';
  import Close from './close.vue';
  import { useNamespace } from '@etfma/hooks';

  import { tagEmits, tagProps } from './tag';

  defineOptions({
    name: 'EtfmaTag',
  });
  const props = defineProps(tagProps);
  const emit = defineEmits(tagEmits);

  const ns = useNamespace('tag');
  const containerKls = computed(() => {
    const { type, hit, effect, closable, round, size } = props;
    return [
      ns.b(),
      ns.is('closable', closable),
      ns.m(type),
      ns.m(size),
      ns.m(effect),
      ns.is('hit', hit),
      ns.is('round', round),
    ];
  });

  // methods
  const handleClose = (event: MouseEvent) => {
    emit('close', event);
  };

  const handleClick = (event: MouseEvent) => {
    emit('click', event);
  };
</script>
