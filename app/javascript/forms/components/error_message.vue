<template>
    <div v-if="inputTouched" class="invalid-feedback"> {{ inputError }}  </div>
</template>


<script>
  export default {
    inheritAttrs: false,
    props: {
      name:{
        type:String,
        require:true
      },
    },
    computed: {
      inputError: function() {
        if (this.inputTouched) {
          return this.$store.getters.getError(this.$props.name)
        } else {
          return null
        }
      },
      inputTouched: {
        get () {
          return this.$store.getters.getTouched(this.$props.name)
        },
        set (value) {
          this.$store.commit('setTouched', {
              value: value,
              name: this.$props.name
            }
          )
        }
      },
    },
  }
</script>

