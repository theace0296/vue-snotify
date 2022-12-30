<template>
  <div class="wrapper">
    <aside>
      <h3 class="text-center">
        Toast config
      </h3>
      <div class="form-group form-group-sm">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="title"
          type="text"
          class="form-control"
        >
      </div>
      <div class="form-group form-group-sm">
        <label for="body">Body</label>
        <textarea
          id="body"
          v-model="body"
          rows="2"
          class="form-control"
        />
      </div>
      <div class="row">
        <div class="col-xs-6">
          <div class="form-group form-group-sm">
            <label for="titlemaxlen">Title max-length</label>
            <input
              id="titlemaxlen"
              v-model.number="titleMaxLength"
              type="text"
              min="0"
              class="form-control"
            >
          </div>
        </div>
        <div class="col-xs-6">
          <div class="form-group form-group-sm">
            <label for="bodymaxlen">Body max-length</label>
            <input
              id="bodymaxlen"
              v-model.number="bodyMaxLength"
              type="text"
              min="0"
              class="form-control"
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-6">
          <div class="form-group form-group-sm">
            <label for="timeout">Timeout</label>
            <input
              id="timeout"
              v-model.number="timeout"
              type="number"
              min="0"
              class="form-control"
            >
          </div>
        </div>
        <div class="col-xs-6">
          <div class="form-group form-group-sm">
            <label for="backdrop"> Backdrop (0.0 - 1.0) </label>
            <input
              id="backdrop"
              v-model="backdrop"
              type="number"
              class="form-control"
              min="-1"
              max="1"
              step="0.1"
            >
          </div>
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label for="position">Position</label>
        <div class="row">
          <div class="col-sm-12">
            <select
              id="position"
              v-model="position"
              class="form-control"
            >
              <option value="leftTop">
                LEFT - TOP
              </option>
              <option value="leftCenter">
                LEFT - CENTER
              </option>
              <option value="leftBottom">
                LEFT - BOTTOM
              </option>
              <option value="rightTop">
                RIGHT - TOP
              </option>
              <option value="rightCenter">
                RIGHT - CENTER
              </option>
              <option value="rightBottom">
                RIGHT - BOTTOM
              </option>
              <option value="centerTop">
                CENTER - TOP
              </option>
              <option value="centerCenter">
                CENTER - CENTER
              </option>
              <option value="centerBottom">
                CENTER - BOTTOM
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="switch-group-wrapper">
        <div class="switch-wrapper">
          <strong>Show progress bar?</strong>
          <div class="switch">
            <input
              id="progressBar"
              v-model="progressBar"
              class="cmn-toggle cmn-toggle-yes-no"
              type="checkbox"
            >
            <label
              for="progressBar"
              data-on="On"
              data-off="Off"
            />
          </div>
        </div>
        <div class="switch-wrapper">
          <strong>Close on click?</strong>
          <div class="switch">
            <input
              id="closeClick"
              v-model="closeClick"
              class="cmn-toggle cmn-toggle-yes-no"
              type="checkbox"
            >
            <label
              for="closeClick"
              data-on="On"
              data-off="Off"
            />
          </div>
        </div>
        <div class="switch-wrapper">
          <strong>Pause on hover?</strong>
          <div class="switch">
            <input
              id="pauseHover"
              v-model="pauseHover"
              class="cmn-toggle cmn-toggle-yes-no"
              type="checkbox"
            >
            <label
              for="pauseHover"
              data-on="On"
              data-off="Off"
            />
          </div>
        </div>
        <div class="switch-wrapper">
          <strong>New items on top?</strong>
          <div class="switch">
            <input
              id="newTop"
              v-model="newTop"
              class="cmn-toggle cmn-toggle-yes-no"
              type="checkbox"
            >
            <label
              for="newTop"
              data-on="On"
              data-off="Off"
            />
          </div>
        </div>
        <div class="switch-wrapper">
          <strong>One in queue?</strong>
          <div class="switch">
            <input
              id="oneAtTime"
              v-model="oneAtTime"
              class="cmn-toggle cmn-toggle-yes-no"
              type="checkbox"
            >
            <label
              for="oneAtTime"
              data-on="On"
              data-off="Off"
            />
          </div>
        </div>
        <div class="switch-wrapper">
          <strong>One type in queue?</strong>
          <div class="switch">
            <input
              id="preventDuplicates"
              v-model="preventDuplicates"
              class="cmn-toggle cmn-toggle-yes-no"
              type="checkbox"
            >
            <label
              for="preventDuplicates"
              data-on="On"
              data-off="Off"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-6">
          <div class="form-group form-group-sm">
            <label for="dockMax"> Max on screen </label>
            <input
              id="dockMax"
              v-model="dockMax"
              type="number"
              class="form-control"
              min="1"
            >
          </div>
        </div>
        <div class="col-xs-6">
          <div class="form-group form-group-sm">
            <label for="blockMax"> Max at position </label>
            <input
              id="blockMax"
              v-model="blockMax"
              type="number"
              class="form-control"
              min="1"
            >
          </div>
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label for="style">Toast Style</label>
        <div class="row">
          <div class="col-sm-12">
            <select
              id="style"
              v-model="style"
              class="form-control"
            >
              <option value="material">
                Material
              </option>
              <option value="dark">
                Dark
              </option>
              <option value="simple">
                Simple
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="form-group form-group-sm">
        <div class="buttons">
          <div class="btn-group btn-group-justified">
            <div
              class="btn btn-success"
              @click="onSuccess"
            >
              Success
            </div>
            <div
              class="btn btn-info"
              @click="onInfo"
            >
              Info
            </div>
            <div
              class="btn btn-danger"
              @click="onError"
            >
              Error
            </div>
            <div
              class="btn btn-warning"
              @click="onWarning"
            >
              Warning
            </div>
          </div>
          <div class="btn-group btn-group-justified">
            <div
              class="btn btn-default"
              @click="onSimple"
            >
              Simple
            </div>
            <div
              class="btn btn-blue"
              @click="onAsyncLoading"
            >
              Async
            </div>
            <div
              class="btn btn-teal"
              @click="onConfirmation"
            >
              Confirm
            </div>
            <div
              class="btn btn-black"
              @click="onPrompt"
            >
              Prompt
            </div>
          </div>
          <div class="btn-group btn-group-justified">
            <div
              class="btn btn-default"
              @click="onHtml"
            >
              HTML
            </div>
          </div>
        </div>
      </div>
      <div
        class="btn btn-block btn-primary"
        @click="onClear"
      >
        Clear all
      </div>
    </aside>
    <div class="content">
      <main>
        <div class="brand">
          <h1>Vue-Snotify</h1>
          <p>Vue.js 3 Notification Center</p>
        </div>
      </main>
      <footer>
        <div class="footer">
          <a
            href="https://github.com/theace0296/vue-snotify"
            target="_blank"
          >GitHub</a>
          &#9673;
          <a
            href="https://www.npmjs.com/package/vue-snotify"
            target="_blank"
          >NPM</a>
          <h6>MIT</h6>
        </div>
      </footer>
      <vue-snotify :class="style" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SnotifyToast, SnotifyPosition, SnotifyToastConfig } from '.';

export default defineComponent({
  data () {
    return {
      style: 'material',
      title: 'Snotify title!',
      body: 'Lorem ipsum dolor sit amet!',
      timeout: 3000,
      position: SnotifyPosition.rightBottom,
      progressBar: true,
      closeClick: true,
      newTop: true,
      backdrop: -1,
      dockMax: 8,
      blockMax: 6,
      pauseHover: true,
      titleMaxLength: 15,
      bodyMaxLength: 80,
      oneAtTime: false,
      preventDuplicates: false,
    };
  },
  methods: {
    /** Change global configuration */
    getConfig (): SnotifyToastConfig {
      this.$snotify.setDefaults({
        global: {
          newOnTop: this.newTop,
          maxAtPosition: this.blockMax,
          maxOnScreen: this.dockMax,
          oneAtTime: this.oneAtTime,
          preventDuplicates: this.preventDuplicates,
        },
      });
      return {
        bodyMaxLength: this.bodyMaxLength,
        titleMaxLength: this.titleMaxLength,
        backdrop: this.backdrop,
        position: this.position,
        timeout: this.timeout,
        showProgressBar: this.progressBar,
        closeOnClick: this.closeClick,
        pauseOnHover: this.pauseHover,
      };
    },
    mapCallbacks (toast: SnotifyToast) {
      toast.on('beforeShow', (toast) => {
        console.log(`${toast.title} - beforeShow`);
      });
      toast.on('mounted', (toast) => {
        console.log(`${toast.title} - mounted`);
      });
      toast.on('shown', (toast) => {
        console.log(`${toast.title} - shown`);
      });
      toast.on('beforeHide', (toast) => {
        console.log(`${toast.title} - beforeHide`);
      });
      toast.on('click', (toast) => {
        console.log(`${toast.title} - click`);
      });
      toast.on('destroyed', (toast) => {
        console.log(`${toast.title} - destroyed`);
      });
      toast.on('hidden', (toast) => {
        console.log(`${toast.title} - hidden`);
      });
      toast.on('input', (toast) => {
        console.log(`${toast.title} - input`);
      });
      toast.on('mouseenter', (toast) => {
        console.log(`${toast.title} - mouseenter`);
      });
      toast.on('mouseleave', (toast) => {
        console.log(`${toast.title} - mouseleave`);
      });
    },
    onSuccess () {
      const toast = this.$snotify.success(
        this.body,
        this.title,
        this.getConfig()
      );
      if (toast) {
        this.mapCallbacks(toast);
      }
    },
    onInfo () {
      this.$snotify.info(this.body, this.title, this.getConfig());
    },
    onError () {
      this.$snotify.error(this.body, this.title, this.getConfig());
    },
    onWarning () {
      this.$snotify.warning(this.body, this.title, this.getConfig());
    },
    onSimple () {
      const icon = 'https://via.placeholder.com/100/e85b5b/FFFFFF/?text=Vue-Snotify';
      this.$snotify.simple(this.body, this.title, {
        ...this.getConfig(),
        icon: icon,
      });
    },
    onAsyncLoading () {
      /**
       * You should pass Promise or Observable of type Snotify to change some data or do some other actions
       * More information how to work with observables:
       * https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/create.md
       */
      const config = this.getConfig(); // Omit timeout
      this.$snotify.async(
        'Called with promise',
        'Error async',
        () =>
          new Promise((resolve, reject) => {
            setTimeout(
              () =>
                reject({
                  title: 'Error!!!',
                  body: 'We got an example error!',
                  config: {
                    ...config,
                    closeOnClick: true,
                    timeout: 8000,
                  },
                }),
              2000
            );
          })
      );

      this.$snotify.async(
        'Called with promise',
        'Success async',
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  title: 'Success!!!',
                  body: 'We got an example success!',
                  config: {
                    ...config,
                    closeOnClick: true,
                  },
                }),
              2000
            );
          })
      );
    },
    onConfirmation () {
      /**
       * Here we pass an buttons array, which contains of 2 element of type SnotifyButton
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { timeout, closeOnClick, ...config } = this.getConfig(); // Omit props what i don't need
      const toast = this.$snotify.confirm(this.body, this.title, {
        ...config,
        buttons: [
          {
            text: 'Yes',
            action: () => console.log('Clicked: Yes'),
            bold: false,
          },
          { text: 'No', action: () => console.log('Clicked: No') },
          {
            text: 'Later',
            action: (toast) => {
              console.log('Clicked: Later');
              this.$snotify.remove(toast.id);
            },
          },
          {
            text: 'Close',
            action: (toast) => {
              console.log('Clicked: Close');
              this.$snotify.remove(toast.id);
            },
            bold: true,
            className: 'btn-cool',
          },
        ],
      });
      if (toast) {
        this.mapCallbacks(toast);
      }
    },
    onPrompt () {
      /**
       * Here we pass an buttons array, which contains of 2 element of type SnotifyButton
       * At the action of the first button we can get what user entered into input field.
       * At the second we can't get it. But we can remove this toast
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { timeout, closeOnClick, ...config } = this.getConfig(); // Omit props what i don't need
      const toast = this.$snotify
        ?.prompt(this.body, this.title, {
          ...config,
          buttons: [
            {
              text: 'Yes',
              action: (toast) => console.log('Said Yes: ' + toast.value),
            },
            {
              text: 'No',
              action: (toast) => {
                console.log('Said No: ' + toast.value);
                this.$snotify.remove(toast.id);
              },
            },
          ],
          placeholder: 'Enter "ng-snotify" to validate this input', // Max-length = 40
        })
        ?.on('input', (toast) => {
          console.log(toast.value);
          toast.valid = !!toast.value.match('ng-snotify');
        });
      if (toast) {
        this.mapCallbacks(toast);
      }
    },
    onHtml () {
      const html = `<div class="snotifyToast__title"><b>Html Bold Title</b></div>
      <div class="snotifyToast__body"><i>Html</i> <b>toast</b> <u>content</u></div>`;
      this.$snotify.html(html, this.getConfig());
    },
    onClear () {
      this.$snotify.clear();
    },
  },
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Audiowide');
.material {
  @import "styles/material";
}
.simple {
  @import "styles/simple";
}
.dark {
  @import "styles/dark";
}
.snotify-icon {
  object-fit: cover;
  width: 100%;
  height: 100%;
  object-position: center;
}
.wrapper {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  @media (max-width: 767px) {
    flex-flow: column nowrap;
    height: auto;
    font-size: 12px;
  }
  aside {
    flex: 0 0 350px;
    padding: 10px 15px;
    overflow-y: auto;
    z-index: 99999;
    background-color: #fff;
    .btn-group {
      .btn {
        padding: 6px 9px;
      }
    }
    h3 {
      margin: 0;
    }
    @media (max-width: 767px) {
      order: 1;
      overflow: initial;
    }
  }
  .content {
    position: relative;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    background: #EA5C54; /* Old browsers */
    background: -moz-linear-gradient(-45deg, #EA5C54 0%, #bb6dec 100%); /* FF3.6+ */
    background: -webkit-gradient(linear, left top, right bottom, color-stop(0%, #EA5C54), color-stop(100%, #bb6dec)); /* Chrome,Safari4+ */
    background: -webkit-linear-gradient(-45deg, #EA5C54 0%, #bb6dec 100%); /* Chrome10+,Safari5.1+ */
    background: -o-linear-gradient(-45deg, #EA5C54 0%, #bb6dec 100%); /* Opera 11.10+ */
    background: -ms-linear-gradient(-45deg, #EA5C54 0%, #bb6dec 100%); /* IE10+ */
    background: linear-gradient(135deg, #EA5C54 0%, #bb6dec 100%); /* W3C */
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EA5C54 ', endColorstr='#bb6dec', GradientType=1); /* IE6-9 fallback on horizontal gradient */
    main {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .brand {
        position: absolute;
        color: #ffffff;
        h1 {
          font-family: 'Audiowide', cursive;
          font-display: swap;
          font-size: 6em;
        }
        p {
          font-size: 2em;
          text-align: center;
        }
        @media (max-width: 992px) {
          h1 {
            font-size: 4.5em;
          }
          p {
            font-size: 1.8em;
          }
          @media (max-width: 767px) {
            h1 {
              font-size: 4em;
            }
            p {
              font-size: 1.5em;
            }
          }
        }
      }
      @media (max-width: 767px) {
        flex-flow: column nowrap;
        order: 0;
        height: 110px;
      }
    }
    footer {
      flex: 0 0 65px;
      text-align: center;
      color: #ffffff;
      font-size: 1em;
      a {
        color: #fff;
      }
      h6 {
        font-size: .9em;
      }
      @media (max-width: 767px) {
        flex: 0 0 40px;
      }
    }
  }
}
.buttons {
  margin: 20px 0;
}
.btn-group {
  margin: 5px 0 0;
}
.btn-black {
  color: #f8f8f8;
  background-color: #2d2d2d;
  border-color: #000000;
  &:hover {
    color: #fff;
    background-color: #000000;
    border-color: #000000;
  }
}
.btn-blue {
  color: #f8f8f8;
  background-color: #2095F2;
  border-color: #1a80d1;
  &:hover {
    color: #fff;
    background-color: #1a80d1;
    border-color: #1a80d1;
  }
}
.btn-teal {
  color: #f8f8f8;
  background-color: #009587;
  border-color: #018175;
  &:hover {
    color: #fff;
    background-color: #018175;
    border-color: #018175;
  }
}
.switch-wrapper {
  width: 50%;
}
.switch-group-wrapper {
  display: flex;
  flex-flow: row wrap;
  margin: 5px 0 10px;
}
.cmn-toggle {
  position: absolute;
  margin-left: -9999px;
  padding: 2px;
  width: 60px;
  height: 30px;
  visibility: hidden;
  + label {
    display: block;
    position: relative;
    padding: 2px;
    width: 60px;
    height: 30px;
    cursor: pointer;
    outline: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    &::before,
    &::after {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      color: #fff;
      font-family: "Roboto Slab", serif;
      font-size: 20px;
      text-align: center;
      line-height: 30px;
    }
    &::before {
      background-color: #dddddd;
      content: attr(data-off);
      transition: transform 0.5s;
      backface-visibility: hidden;
    }
    &::after {
      background-color: #8ce196;
      content: attr(data-on);
      transition: transform 0.5s;
      transform: rotateY(180deg);
      backface-visibility: hidden;
    }
  }
  &:checked {
    + label {
      &::before {
        transform: rotateY(180deg);
      }
      &::after {
        transform: rotateY(0);
      }
    }
  }
}
</style>
