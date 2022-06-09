<template>
    <div v-bind="this.$attrs" v-on:click="handleClick" v-bind:class="classNames">
        <input type="hidden"  :name="name" v-model="inputValue" />
        <span>
            <slot></slot>
        </span>
    </div>
</template>


<script>
  import{ Utils } from 'k-utils-js'

  export default {
    inheritAttrs: false,
    props: {
      false_value: {
        type:String,
        required:true
      },
      true_value: {
        type:String,
        required:true
      },
      name:{
        type:String,
        require:true
      },
      value: {
        type:String,
        required:true
      },
      disabled: {
        type:String,
        required:false
      }
    },
    methods:{

      handleClick:function(event) {
        this.$store.commit('setTouched', {
            value: true,
            name: this.$props.name
          }
        )

        if (this.isTruthy(this.$props.disabled)) {
          //disable month, no changes allowed
          return
        }

        let selectedMonths = this.getSelectedMonths()
        let currentMonth = this.getCurrentMonth()
        let months = this.getMonths()

        if (this.isFalsy(this.inputValue)) {
         // user tries to select a month

          if (selectedMonths.length === 0) {
            // user wants to select the first month => we let him do it

            this.selectMonth(currentMonth);
          } else {
            // the user clicked  to extend the strip to the left or to the right

            months.forEach((month) => {
              if (((month >= currentMonth) && (month < selectedMonths[0])) || ((month <= currentMonth) && (month > selectedMonths.slice(-1)[0]))) {
                this.selectMonth(month)
              }
            })
          }
        } else {
          // user tries to unselect a month

          if (selectedMonths.length === 1 && selectedMonths[0] === currentMonth) {
            // user clicked on the previously selected month and wants to unselect it => we let him do it

            this.unselectMonth(currentMonth)
          } else if (currentMonth === selectedMonths[0]) {
            // the user clicked on the left margin in order to unselect it => we let him do it and unselect all the items in the middle

            months.forEach((month) => {
              if ((month >= currentMonth) && (month < selectedMonths.slice(-1)[0])) {
                this.unselectMonth(month)
              }
            })
          } else if (currentMonth === selectedMonths.slice(-1)[0]) {
            // the user clicked on the right margin in order to unselect it => we let him do it and unselect all the items in the middle

            months.forEach((month) => {
              if (month > selectedMonths[0] && month <= currentMonth) {
                this.unselectMonth(month)
              }
            })
          } else {
            // the user clicked on a middle item => do nothing
          }

        }

        //this.toggleInputValue()
        console.log(this.getCurrentMonth(), this.getSelectedMonths())
      },

      toggleInputValue: function() {
        if (this.inputValue === this.$props.true_value) {
          this.inputValue = this.$props.false_value
        } else  {
          this.inputValue = this.$props.true_value
        }
      },

      isTruthy: function(value) {
        return (value === true || value === this.$props.true_value)
      },

      isFalsy: function(value) {
        return !this.isTruthy(value)
      },

      isStripLimit: function() {
        let selectedMonths = this.getSelectedMonths()
        let currentMonth = this.getCurrentMonth()
        if (selectedMonths.lenght === 0) {
          return false
        } else {
          return (currentMonth === selectedMonths[0] || currentMonth === selectedMonths.slice(-1)[0])
        }
      },


      getSelectedMonths: function() {
        let items = this.$store.getters.getValue("interest.items_attributes")
        let selectedMonths = []

        for (const id in items) {
          let item = items[id]
          if (this.isTruthy(item.selected)) {
            selectedMonths.push(item.shipment_date_min)
          }
        }
        return selectedMonths.sort();
      },

      getMonths: function() {
        let items = this.$store.getters.getValue("interest.items_attributes")
        let months = []

        for (const id in items) {
          let item = items[id]
          months.push(item.shipment_date_min)
        }
        return months.sort();
      },
      getCurrentMonth: function() {
        let itemId = Utils.dotify(this.$props.name).split(".").slice(-2)[0]
        let items = this.$store.getters.getValue("interest.items_attributes")
        return items[itemId].shipment_date_min;
      },
      selectMonth: function(month) {
        let items = this.$store.getters.getValue("interest.items_attributes")
        for (const id in items) {
          let item = items[id]
          if (item.shipment_date_min === month) {
            this.$store.dispatch('update', {
              value: this.$props.true_value,
              name: `interest.items_attributes.${id}.selected`
            })
          }
        }
      },
      unselectMonth: function(month) {
        let items = this.$store.getters.getValue("interest.items_attributes")
        for (const id in items) {
          let item = items[id]
          if (item.shipment_date_min === month) {
            this.$store.dispatch('update', {
              value: this.$props.false_value,
              name: `interest.items_attributes.${id}.selected`
            })
          }

        }
      }

    },
    computed: {

      classNames: function() {
        return {
          'month': true,
          'month-not-selected': this.isFalsy(this.inputValue),
          'month-selected': this.isTruthy(this.inputValue),
          'month-selected-limit': this.isStripLimit(),
          'month-clickable': this.isFalsy(this.$props.disabled) &&  ((this.isTruthy(this.inputValue) && this.isStripLimit()) || this.isFalsy(this.inputValue))
        }
      },
      inputValue: {
        get () {
          let value = this.$store.getters.getValue(this.$props.name)
          if (value === true || value === this.$props.true_value) {
            return this.$props.true_value
          } else {
            return this.$props.false_value
          }
        },
        set (value) {
          this.$store.dispatch('update', {
              value: (value === true || value === this.$props.true_value) ? this.$props.true_value : this.$props.false_value,
              name: this.$props.name
            }
          )
        }
      },
    },
  }
</script>

