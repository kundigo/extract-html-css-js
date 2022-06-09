<template>
    <span v-if="displayCount">{{inputValue.length}}/{{this.$props.max_length}}</span>
</template>


<script>
export default {
  inheritAttrs: false,
  props: {
    name:{
      type:String,
      require:true
    },
    max_length:{
      type: String,
      require:true
    }
  },
  computed: {
    displayCount: function() {
      const result = this.$store.getters.getValue(this.$props.name);
     return !!result
    },
    inputValue: {
      get () {
       return this.$store.getters.getValue(this.$props.name)
      },
      set (value) {
        this.$store.dispatch('update', {
              value: value,
              name: this.$props.name
            }
        )
      }
    },
  },
}
</script>

