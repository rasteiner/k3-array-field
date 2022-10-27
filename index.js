panel.plugin('rasteiner/k3-array-field', {
  fields: {
    array: {
      data() {
        return {
          currentlyEditing: null,
          currentModel: null,
        }
      },
      props: {
        label: String,
        value: Array,
        field: Object,
        empty: String|Object,
      },
      template: `
        <k-field v-bind="$props" class="rs-array-field" @click.native.stop>

          <template #options>
            <k-button
              @click="addOne"
              icon="add"
              :text="$t('add')"
            />
          </template>

          <k-draggable
            v-if="value.length"
            class="k-items k-list-items"
            :handle="true"
            :options="dragOptions"
            data-layout="list"
            :list="values"
            @change="$emit('change', $event)"
            @end="$emit('sort', items, $event)"
          >
            <template v-for="(item, itemIndex) in values">
              <slot v-bind="{ item, itemIndex }">
                <k-structure-form
                  v-if="currentlyEditing === itemIndex"
                  v-model="currentModel"
                  :fields="fields"
                  :index="1"
                  :total="1"
                  @close="close()"
                  @discard="close()"
                  @submit="update(itemIndex, currentModel)"
                />

                <k-item v-else @click="open(itemIndex)">
                  {{ item.value }}
                  <template #options>
                    <k-button @click="remove(itemIndex)" icon="remove" />
                  </template>
                </k-item>

              </slot>
            </template>
          </k-draggable>

          <!-- Empty State -->
          <k-empty
            v-else-if="value.length === 0"
            icon="list-bullet"
            @click="addOne"
          >
            {{ empty || $t("field.structure.empty") }}
          </k-empty>
        </k-field>
      `,
      computed: {
        dragOptions() {
          return {
            sort: true,
            disabled: false,
            draggable: ".k-draggable-item"
          };
        },
        fields() {
          return {
            value: this.field
          }
        },
        values() {
          return this.value.map(entry => ({
            value: entry
          }))
        }
      },
      methods: {
        close() {
          if(this.currentModel.value === undefined || this.currentModel.value === null) {
            this.remove(this.currentlyEditing)
          }
          this.currentlyEditing = null;
          this.currentModel = null;
        },

        open(index) {
          this.currentlyEditing = index
          this.currentModel = {
            ...this.values[index]
          }
        },

        update(index, value) {
          this.$emit('input', [
            ...this.value.slice(0, index),
            value.value,
            ...this.value.slice(index + 1)
          ])
          this.currentModel = null
          this.currentlyEditing = null
        },

        remove(index) {
          this.$emit('input', [
            ...this.value.slice(0, index),
            ...this.value.slice(index + 1)
          ])
        },

        addOne() {
          this.$emit('input', [
            ...this.value,
            null
          ])
          this.open(this.value.length)
        }
      }

    }
  }
})
