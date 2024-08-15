<template>
  <bib-modal-wrapper no-header>
    <div class="title">{{$t('common.feedback')}}</div>
    <div class="content">
      <bib-input
        type="textarea"
        v-model="feedbackDescription"
        :placeholder="$t('common.feedbackPlaceholder')"
        label=""
      />
      <div class="input-drag-drop" id="input-drag-area">
        <div class="drag-drop-description">{{$t('common.feedbackDragDropDescription')}}</div>
        <div class="drag-drop-link" @click="openFileExplorer">{{$t('common.feedbackDragDropLink')}}</div>
        <input
          type="file"
          @change="fileSelected($event)"
          id="file-input"
          class="d-none"
          variant="dark"
          multiple
          ref="file_input"
        />
        <div class="d-block of-scroll-y file-list" v-show="inputFiles.length > 0">
        <template v-for="(file, key) in inputFiles">
          <div
            class="shape-rounded mt-05 height-205 pl-05 d-flex justify-between align-center bg-light"
            :key="key"
          >
            <div class="d-flex w-75 align-center">
              <bib-icon icon="file" variant="gray5"></bib-icon>

              <h5
                class="pl-025 font-w-400 of-hidden text-of-elipsis text-wrap"
              >
                {{ file.name }}
              </h5>
            </div>
            <div
              @click="removeFile(file, $event)"
              class="pr-05 cursor-pointer"
            >
              <bib-icon
                icon="trash"
                :scale="1.5"
                variant="gray5"
              ></bib-icon>
            </div>
          </div>
        </template>
      </div>
      </div>
      <div class="footer">
        <bib-button class="button-cancel" :label="$t('common.cancel')" size="lg" variant="gray" @click="$emit('close')"></bib-button>
        <bib-button class="button-submit" :label="$t('common.submit')" size="lg" variant="primary" @click="$emit('submit', {inputFiles, feedbackDescription, companyName})" :disabled="!feedbackDescription.trim()"></bib-button>
      </div>
    </div>
  </bib-modal-wrapper>
</template>

<script>
import { getBusiness } from "~/model/business";
export default {
  props: ["isLightTheme"],
  data() {
    return {
      feedbackDescription: '',
      inputFiles: [],
      companyName: ''
    };
  },
  async created() {
    this.$store.dispatch('loading/set', true)
    const resp = await getBusiness({ businessId: this.$store.state.account.data.businessId })
    if (resp.err) {
      this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
      setTimeout(async () => {
        await this.$store.dispatch('notification/set', [false, '', ''])
      }, 5000)
    } else {
      this.companyName = resp[0] && resp[0].CompanyName
    }
    this.$store.dispatch('loading/set', false)
  },
  mounted() {
    let dropArea = document.getElementById("input-drag-area");
    if (dropArea) {
      ["dragenter", "dragover"].forEach((eventName) => {
        dropArea.addEventListener(eventName, (event) => {
          event.preventDefault();
          dropArea.classList.remove("border-gray4");
          dropArea.classList.add("border-success");
        });
      });
      [("dragleave", "drop")].forEach((eventName) => {
        dropArea.addEventListener(eventName, (event) => {
          event.preventDefault();
          dropArea.classList.remove("border-success");
          dropArea.classList.add("border-gray4");
        });
      });
      dropArea.addEventListener(
        "drop",
        (e) => {
          let dt = e.dataTransfer;
          if (dt) {
            let files = dt.files;

            for (let file of files) {
              const fileId = file.name;

              if (!this.inputFiles.some(f => f.name === fileId)) {
                this.inputFiles.push(file);
              }
            }
            if (!this.feedbackDescription) {
              this.feedbackDescription = `Feedback on <${document.title}> (${window.location.origin}${this.$route.fullPath})`;
            }
          }
        },
        false
      );
    }
  },
  methods: {
    fileSelected(event) {
      if (event.target.files) {
        for (let file of event.target.files) {
          const fileId = file.name;

          if (!this.inputFiles.some(f => f.name === fileId)) {
            this.inputFiles.push(file);
          }
        }
        if (!this.feedbackDescription) {
          this.feedbackDescription = `Feedback on <${document.title}> (${window.location.origin}${this.$route.fullPath})`;
        }
      }
    },
    openFileExplorer() {
      document.getElementById("file-input").click();
    },
    removeFile(file, e) {
      this.inputFiles = this.inputFiles.filter(function (fl) {
        return fl.name != file.name;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .modal__wrapper {
  display: flex;
  padding-top: 16px;
  align-items: flex-start;  
  border-radius: 6px !important;
  border: 1px solid var(--border-border-primary, #E9E9E9);
  background: var(--surface-surface-secondary, #F9F9F9);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.16) !important;
  .modal__wrapper__default {
    width: 100%;
    height: 100%;
  }
  [id^="input-drag-area-"] {
    display: flex;
    padding: 16px;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 8px;
    border: 2px dashed var(--border-border-primary, #E9E9E9);
  }
  .input label{
    color: var(--text-text-primary, #1D1D20);
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  .input textarea {
    height: 144px;
    padding-top: 8px;
    padding-left: 16px;
    padding-right: 16px;
    border: 1px solid var(--border-border-primary, #E9E9E9);
    line-height: 150%; /* 21px */
  }
  .input textarea::placeholder {
    color: var(--text-text-primary, #1D1D20);
  }
  .title {
    width: Fill (388px)px;
    height: Hug (17px)px;
    padding: 0px 16px 0px 16px;
    gap: 6px;
    color: var(--text-text-primary, #1D1D20);
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  .content {
    display: flex;
    padding: 16px;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    align-self: stretch;
    .input-drag-drop {
      max-height: 30vh;
      display: flex;
      padding: 16px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 8px;
      align-self: stretch;
      border-radius: 8px;
      border: 2px dashed var(--border-border-primary, #E9E9E9);
      .drag-drop-description {
        align-self: stretch;
        color: var(--text-text-primary, #1D1D20);
        text-align: center;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 150%; /* 21px */
      }
      .drag-drop-link {
        cursor: pointer;
        align-self: stretch;
        color: var(--text-text-primary, #1D1D20);
        text-align: center;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%; /* 21px */
        text-decoration-line: underline;
      }
      .file-list {
        width: 100%;
      }
    }
    .footer {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 16px;
      align-self: stretch;
      .text-center {
        justify-content: center;
      }
      .button-cancel {
        cursor: pointer;
        display: flex;
        height: 32px;
        padding: 8px 12px 8px 8px;
        justify-content: center;
        align-items: center;
        gap: 6px;
        flex: 1 0 0;
        border-radius: 6px;
        background: var(--border-border-primary, #E9E9E9);
        color: #8D8D8F;
        p {
          color: var(--text-text-secondary, #8D8D8F);
          text-align: center;
          font-family: Inter;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
      }
      .button-submit {
        cursor: pointer;
        display: flex;
        height: 32px;
        padding: 8px 12px 8px 8px;
        justify-content: center;
        align-items: center;
        gap: 6px;
        flex: 1 0 0;
        border-radius: 6px;
        background: var(--color-brand-blue, #0741A3);
        color: #FFFFFF;
        p {
          color: var(--color-base-white, #FFF);
          text-align: center;
          font-family: Inter;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
      }
      .button--disabled {
        cursor: not-allowed;
        background-color: $primary-sub2;
      }
    }
  }
}

::v-deep .modal__wrapper--dark {
  border: 1px solid var(--bib-border-primary);
  .input textarea {
    border: 1px solid var(--bib-border-primary);
    background-color: var(--bib-text);
    color: var(--bib-secondary);
  }
  .input,
  .textarea {
    &::placeholder {
      background-color: var(--bib-text);
      color: var(--bib-secondary);

      &:hover {
        background-color: var(--bib-black);
      }
    }
  }
  .title {
    color: white;
  }
  .content {
    .input-drag-drop {
      .d-block {
        scrollbar-color: var(---bib-surface-tertiary) !important;
      }
      border: 2px dashed var(--bib-border-primary);
      .drag-drop-description {
        color: white;
      }
      .drag-drop-link {
        color: var(--bib-secondary);
      }
      .shape-rounded {
        background-color: var(--bib-surface-tertiary) !important;
      }
    }
  }
  .footer {
    .button-cancel {
      background-color: var(--bib-surface-tertiary) !important;
    }
    .button-submit {
      &.button--disabled {
        cursor: not-allowed;
        background-color: var(--bib-primary-24-sub4);
      }
    }
  }
}
</style>
