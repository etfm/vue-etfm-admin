import { Ref, ref, watchEffect } from 'vue';

export function useTransformVlaue({
  wrapperWidth,
  wrapperScrollWidth,
}: {
  wrapperWidth: Ref<number>;
  wrapperScrollWidth: Ref<number>;
}) {
  const transformMin = ref(0);
  const transformMax = ref(0);

  watchEffect(() => {
    transformMin.value = Math.min(0, wrapperWidth.value - wrapperScrollWidth.value);
    transformMax.value = 0;
  });

  const alignInRange = (value: number): number => {
    if (value < transformMin.value) {
      return transformMin.value;
    }
    if (value > transformMax.value) {
      return transformMax.value;
    }
    return value;
  };

  return {
    alignInRange,
  };
}
