<script setup lang="ts">
import type { ComboboxInputEmits, ComboboxInputProps } from 'reka-ui'

import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { cn } from 'cn'
import { ComboboxInput, useForwardPropsEmits } from 'reka-ui'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<ComboboxInputProps & {
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<ComboboxInputEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxInput
    data-slot="combobox-input"
    :class="cn('min-w-0 flex-1 bg-transparent text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50', props.class)"
    v-bind="{ ...$attrs, ...forwarded }"
  />
</template>
