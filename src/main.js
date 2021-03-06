export default {
  name: 'SlideUpDown',

  props: {
    active: Boolean,
    duration: {
      default: 500,
    },
    tag: {
      type: String,
      default: 'div',
    },
    closedHeight: {
      default: 0,
    },
  },

  data() {
    return {
      maxHeight: this.closedHeight,
      opened: false,
      isInitialized: false,
    };
  },

  render(h) {
    return h(
      this.tag,
      { style: this.style },
      this.$slots.default
    );
  },

  mounted() {
    window.addEventListener('resize', this.layout);
  },

  destroyed() {
    window.removeEventListener('resize', this.layout);
  },

  watch: {
    active: {
      handler() {
        this.layout();
      },
      immediate: true,
    },
  },

  computed: {
    style() {
      if (this.opened) return {};
      const baseStyle = {
        overflow: 'hidden',
        'max-height': `${this.maxHeight}px`,
      };

      if (this.isInitialized) {
        return Object.assign({}, baseStyle, {
          'transition-property': 'max-height',
          'transition-duration': `${this.duration}ms`,
        });
      }
      return baseStyle;
    },
  },

  methods: {
    layout() {
      if (this.active) {
        if (!this.isInitialized) {
          this.isInitialized = true;
          this.opened = true;
          return;
        } else {
          this.isInitialized = true;
          this.maxHeight = this.$el.scrollHeight;
          setTimeout(() => {
            if (this.active) {
              this.opened = true;
            }
          }, this.duration);
        }
      } else {
        if (!this.isInitialized) {
          this.isInitialized = true;
          return;
        }
        this.opened = false;
        this.maxHeight = this.$el.scrollHeight;
        this.$nextTick(() => {
          setTimeout(() => {
            if (!this.active) {
              if (this.maxHeight > this.closedHeight) {
                this.maxHeight = this.closedHeight;
              }
            }
          }, 10);
        });
      }
    },
  },
};
