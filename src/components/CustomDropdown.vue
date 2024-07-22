<template>
    <div class="custom-dropdown">
      <button @click="toggleDropdown" class="dropdown-button">
        {{ selectedOption ? selectedOption.text : placeholder }}
      </button>
      <ul v-if="showDropdown" class="dropdown-menu">
        <li v-for="option in options" :key="option.value" @click="selectOption(option)">
          {{ option.text }}
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, PropType } from 'vue';
  
  interface Option {
    value: string | number;
    text: string;
  }
  
  export default defineComponent({
    name: 'CustomDropdown',
    props: {
      options: {
        type: Array as PropType<Option[]>,
        required: true
      },
      placeholder: {
        type: String,
        default: 'Select an option'
      },
      modelValue: {
        type: [String, Number],
        default: ''
      }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const showDropdown = ref(false);
      const selectedOption = ref<Option | null>(
        props.options.find(option => option.value === props.modelValue) || null
      );
  
      const toggleDropdown = () => {
        showDropdown.value = !showDropdown.value;
      };
  
      const selectOption = (option: Option) => {
        selectedOption.value = option;
        emit('update:modelValue', option.value);
        showDropdown.value = false;
      };
  
      return {
        showDropdown,
        selectedOption,
        toggleDropdown,
        selectOption
      };
    }
  });
  </script>
  
  <style scoped>
  .custom-dropdown {
    position: relative;
    display: inline-block;
  }
  
  .dropdown-button {
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 8px;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }
  
  .dropdown-menu {
    position: absolute;
    background-color: #fff;
    border: 1px solid #ccc;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
  }
  
  .dropdown-menu li {
    padding: 8px;
    cursor: pointer;
  }
  
  .dropdown-menu li:hover {
    background-color: #f0f0f0;
  }
  </style>
  