<template>
    <bib-modal-wrapper v-if="show" size="lg" @close="closeModal" no-header>
        <div slot="content" class="pl-1 pr-1 upgrade-content">
            <div class="custom-close">
                <bib-icon
                variant="gray4"
                class="cursor-pointer"
                :scale="1.5"
                icon="close"
                @click="$emit('close')"
                ></bib-icon>
            </div>
            <div class="custom-title">
              <label>{{$t('people.upgradeRequired')}}</label>
            </div>
            <div class="custom-content">
                <div class="d-flex text-danger pt-2 font-w-600">
                    <div>{{$t('people.seatsExceededNote')}}</div>
                    <span class="ml-auto">10 of 10</span>
                </div>
                <div class="custom-content__separator mt-2 mb-1"></div>
                <div class="mr-2 ml-2">
                    <p>
                        {{$t('people.reviewOptionsNote')}}
                    </p>
                    <div class="custom-content__plan" :class="{'active-plan': isPlan1}" @click="selectPlan('Plan1')">
                        <div></div>
                        <span>+5 {{$t('people.seats')}}</span>
                        <span class="ml-auto">$299/year</span>
                    </div>
                    <div class="custom-content__plan" :class="{'active-plan': isPlan2}" @click="selectPlan('Plan2')">
                        <div></div>
                        <span>+10 {{$t('people.seats')}}</span>
                        <span class="ml-auto">
                            <span class="text-success">{{$t('people.bestDeal')}}</span>
                            $299/year
                        </span>
                    </div>
                    <div class="custom-content__plan" :class="{'active-plan': isPlan3}" @click="selectPlan('Plan3')">
                        <div></div>
                        <span>+20 {{$t('people.seats')}}</span>
                        <span class="ml-auto">$299/year</span>
                    </div>
                </div>
                <div class="align-center justify-between mt-2" slot="footer">
                    <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="closeModal"></bib-button>
                    <bib-button size="lg" :label="$t('common.upgrade')" variant="primary-24" pill></bib-button>
                </div>
            </div>            
        </div>
    </bib-modal-wrapper>
</template>

<script>
export default {
    props: {
        show: Boolean
    },
    data() {
        return {
            isPlan1: false,
            isPlan2: true,
            isPlan3: false,
        }
    },
    methods: {
        selectPlan(value) {
            switch(value) {
                case 'Plan1':
                    this.isPlan1 = true
                    this.isPlan2 = false
                    this.isPlan3 = false
                    break
                case 'Plan2':
                    this.isPlan2 = true
                    this.isPlan1 = false
                    this.isPlan3 = false
                    break
                case 'Plan3':
                    this.isPlan3 = true
                    this.isPlan1 = false
                    this.isPlan2 = false
                    break
                default:
                    break
            }
        },
        closeModal() {
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .modal__wrapper__content {
  padding-top: 0 !important;
  margin-top: 1rem;
}

.upgrade-content {
    position: relative;
    .custom-close {
        position: absolute;
        top: -1.5rem;
        right: -1rem;
    }
    .custom-title {
        position: absolute;
        top: -1.5rem;
        left: 0rem;
        label {
            color: $text-lighter;
            font-weight: 600;
        }
    }
    .custom-content {
        margin-top: 1.5rem;
        &__separator {
            border-top: 2px solid $light;
        }
        &__plan {
            display: flex;
            align-items: center;
            background-color: $background-dark;
            border-radius: 0.2rem;
            padding: 1rem;
            margin-bottom: 1rem;
            div {
                width: 1.1rem;
                height: 1.1rem;
                border-radius: 50%;
                border: 1px solid $text-lighter;
                margin: 0.5rem;
                background: $background;
            }
            &:hover {
                cursor: pointer;
                outline: 1px solid $background-darker;
            }
            &.active-plan {
                outline: 1px solid $primary;
                box-shadow: 0px 0px 5px 5px #7e93ed;
                span {
                    font-weight: 600;
                }
            }
        }
    }
}
</style>