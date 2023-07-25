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
<style lang="scss" scoped module>
  @use 'sass:map';

  @include b(tag) {
    @include set-component-css-var('tag', $tag);
  }

  $tag-border-width: 1px;
  $tag-icon-span-gap: () !default;
  $tag-icon-span-gap: map.merge(
    (
      'large': 8px,
      'default': 6px,
      'small': 4px,
    ),
    $tag-icon-span-gap
  );

  @function returnVarList($var, $type: 'primary') {
    $list: ('fill-color', 'blank');

    @if $var != false {
      $list: ('color', $type, $var);
    }

    @return $list;
  }

  // false mean --etfma-color-white
  @mixin genTheme($backgroundColorWeight, $borderColorWeight, $hoverColorWeight) {
    @each $type in $types {
      &.#{bem('tag', '', $type)} {
        @include css-var-from-global(
          ('tag', 'bg-color'),
          returnVarList($backgroundColorWeight, $type)
        );
        @include css-var-from-global(
          ('tag', 'border-color'),
          returnVarList($borderColorWeight, $type)
        );
        @include css-var-from-global(
          ('tag', 'hover-color'),
          returnVarList($hoverColorWeight, $type)
        );
      }
    }

    @include css-var-from-global(('tag', 'bg-color'), returnVarList($backgroundColorWeight));
    @include css-var-from-global(('tag', 'border-color'), returnVarList($borderColorWeight));
    @include css-var-from-global(('tag', 'hover-color'), returnVarList($hoverColorWeight));
  }

  @include b(tag) {
    $svg-margin-size: 1px;

    @each $type in $types {
      &.#{bem('tag', '', $type)} {
        @include css-var-from-global(('tag', 'text-color'), ('color', $type));
      }
    }

    @each $size in (large, small) {
      @include m($size) {
        height: map.get($tag-height, $size);
        padding: 0 map.get($tag-padding, $size) - $tag-border-width;

        @include set-css-var-value('icon-size', #{map.get($tag-icon-size, $size)});

        .tag__close {
          margin-left: map.get($tag-icon-span-gap, $size);
        }

        &.is-closable {
          padding-right: map.get($tag-icon-span-gap, $size) - $border-width;
        }
      }
    }

    @each $type in $types {
      &.#{bem('tag', '', $type)} {
        @include when(hit) {
          border-color: getCssVar('color', $type);
        }
      }
    }

    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: map.get($tag-height, 'default');
    padding: 0 map.get($tag-padding, 'default') - $border-width;
    font-size: getCssVar('tag-font-size');
    line-height: 1;
    color: getCssVar('tag-text-color');
    white-space: nowrap;
    vertical-align: middle;
    background-color: getCssVar('tag-bg-color');
    border-color: getCssVar('tag-border-color');
    border-style: solid;
    border-width: $tag-border-width;
    border-radius: getCssVar('tag-border-radius');

    @include genTheme('light-9', 'light-8', '');
    @include css-var-from-global(('tag', 'text-color'), ('color', 'primary'));

    @include when(hit) {
      border-color: getCssVar('color', 'primary');
    }

    @include when(round) {
      border-radius: getCssVar('tag', 'border-radius-rounded');
    }

    @include set-css-var-value('icon-size', 14px);

    @include m(dark) {
      @each $type in $types {
        &.#{bem('tag', '', $type)} {
          @include css-var-from-global(('tag', 'text-color'), ('color', 'white'));
        }
      }

      @include genTheme('', '', 'light-3');
      @include css-var-from-global(('tag', 'text-color'), ('color', 'white'));
      @include css-var-from-global(('tag', 'text-color'), ('color', 'white'));
    }

    @include m(plain) {
      @include genTheme(false, 'light-5', '');
      @include css-var-from-global(('tag', 'bg-color'), ('fill-color', 'blank'));
    }

    @include m(small) {
      .icon-close {
        transform: scale(0.8);
      }
    }

    .tag__close {
      color: getCssVar('tag', 'text-color');

      &:hover {
        color: getCssVar('color-white');
        background-color: getCssVar('tag-hover-color');
      }
    }

    .tag__close {
      margin-left: map.get($tag-icon-span-gap, 'default');
      width: getCssVar('icon-size');
      height: getCssVar('icon-size');
      font-size: calc(#{getCssVar('icon-size')} - #{$svg-margin-size * 2});
      cursor: pointer;
      border-radius: 50%;
    }

    &.is-closable {
      padding-right: map.get($tag-icon-span-gap, 'default') - $border-width;
    }
  }
</style>
