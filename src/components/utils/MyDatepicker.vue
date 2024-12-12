<!-- *** -->
<template>
    <span ref="container" :id="d_id" :class="cx('root')" :style="sx('root')" v-bind="ptmi('root')">
        <InputText :pt="ptm('pcInputText')" :ref="inputRef" :class="[inputClass, cx('pcInputText')]"
            :value="inputFieldValue" @click="onInputClick" @input="onInput" @blur="onBlur"></InputText>
        <Portal :appendTo="appendTo" :disabled="inline">
            <transition name="p-connected-overlay" @enter="onOverlayEnter($event)" @after-enter="onOverlayEnterComplete"
                @after-leave="onOverlayAfterLeave" @leave="onOverlayLeave">
                <div v-if="inline || overlayVisible" :ref="overlayRef" :class="[cx('panel'), panelClass]"
                    v-bind="ptm('panel')">
                    <template v-if="!timeOnly">
                        <div :class="cx('calendarContainer')" v-bind="ptm('calendarContainer')">
                            <div v-for="(month, groupIndex) of months" :key="month.month + month.year"
                                :class="cx('calendar')" v-bind="ptm('calendar')">
                                <div :class="cx('header')" v-bind="ptm('header')">
                                    <slot name="header"></slot>
                                    <Button v-show="groupIndex === 0" :ref="previousButtonRef"
                                        :class="cx('pcPrevButton')" :disabled="disabled"
                                        :aria-label="currentView === 'year' ? $primevue.config.locale.prevDecade : currentView === 'month' ? $primevue.config.locale.prevYear : $primevue.config.locale.prevMonth"
                                        :unstyled="unstyled" @click="onPrevButtonClick" v-bind="navigatorButtonProps"
                                        :pt="ptm('pcPrevButton')" data-pc-group-section="navigator">
                                        <template #icon="slotProps">
                                            <slot name="previcon">
                                                <component :is="prevIcon ? 'span' : 'ChevronLeftIcon'"
                                                    :class="[prevIcon, slotProps.class]"
                                                    v-bind="ptm('pcPrevButton')['icon']" />
                                            </slot>
                                        </template>
                                    </Button>
                                    <div :class="cx('title')" v-bind="ptm('title')">
                                        <template v-if="$primevue.config.locale.showMonthAfterYear">
                                            <button v-if="currentView !== 'year'" type="button"
                                                @click="switchToYearView" :class="cx('selectYear')"
                                                :aria-label="$primevue.config.locale.chooseYear"
                                                v-bind="ptm('selectYear')" data-pc-group-section="view">
                                                {{ getYear(month) }}
                                            </button>
                                            <button v-if="currentView === 'date'" type="button"
                                                @click="switchToMonthView" :class="cx('selectMonth')"
                                                :aria-label="$primevue.config.locale.chooseMonth"
                                                v-bind="ptm('selectMonth')" data-pc-group-section="view">
                                                {{ getMonthName(month.month) }}
                                            </button>
                                        </template>
                                        <template v-else>
                                            <button v-if="currentView === 'date'" type="button"
                                                @click="switchToMonthView" :class="cx('selectMonth')"
                                                :aria-label="$primevue.config.locale.chooseMonth"
                                                v-bind="ptm('selectMonth')" data-pc-group-section="view">
                                                {{ getMonthName(month.month) }}
                                            </button>
                                            <button v-if="currentView !== 'year'" type="button"
                                                @click="switchToYearView" :class="cx('selectYear')"
                                                :aria-label="$primevue.config.locale.chooseYear"
                                                v-bind="ptm('selectYear')" data-pc-group-section="view">
                                                {{ getYear(month) }}
                                            </button>
                                        </template>
                                        <span v-if="currentView === 'year'" :class="cx('decade')"
                                            v-bind="ptm('decade')">
                                            <slot name="decade" :years="yearPickerValues"> {{ yearPickerValues[0].value
                                                }} - {{
                                                    yearPickerValues[yearPickerValues.length - 1].value }} </slot>
                                        </span>
                                    </div>
                                    <Button v-show="numberOfMonths === 1 ? true : groupIndex === numberOfMonths - 1"
                                        :ref="nextButtonRef" :class="cx('pcNextButton')" :disabled="disabled"
                                        :aria-label="currentView === 'year' ? $primevue.config.locale.nextDecade : currentView === 'month' ? $primevue.config.locale.nextYear : $primevue.config.locale.nextMonth"
                                        :unstyled="unstyled" @click="onNextButtonClick" v-bind="navigatorButtonProps"
                                        :pt="ptm('pcNextButton')" data-pc-group-section="navigator">
                                        <template #icon="slotProps">
                                            <slot name="nexticon">
                                                <component :is="nextIcon ? 'span' : 'ChevronRightIcon'"
                                                    :class="[nextIcon, slotProps.class]"
                                                    v-bind="ptm('pcNextButton')['icon']" />
                                            </slot>
                                        </template>
                                    </Button>
                                </div>
                                <table v-if="currentView === 'date'" :class="cx('dayView')" role="grid"
                                    v-bind="ptm('dayView')">
                                    <thead v-bind="ptm('tableHeader')">
                                        <tr v-bind="ptm('tableHeaderRow')">
                                            <th v-if="showWeek" scope="col" :class="cx('weekHeader')"
                                                v-bind="ptm('weekHeader', { context: { disabled: showWeek } })"
                                                :data-p-disabled="showWeek" data-pc-group-section="tableheadercell">
                                                <slot name="weekheaderlabel">
                                                    <span
                                                        v-bind="ptm('weekHeaderLabel', { context: { disabled: showWeek } })"
                                                        data-pc-group-section="tableheadercelllabel">
                                                        {{ weekHeaderLabel }}
                                                    </span>
                                                </slot>
                                            </th>
                                            <th v-for="weekDay of weekDays" :key="weekDay" scope="col" :abbr="weekDay"
                                                v-bind="ptm('tableHeaderCell')" data-pc-group-section="tableheadercell"
                                                :class="cx('weekDayCell')">
                                                <span :class="cx('weekDay')" v-bind="ptm('weekDay')"
                                                    data-pc-group-section="tableheadercelllabel">{{
                                                        weekDay }}</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody v-bind="ptm('tableBody')">
                                        <tr v-for="(week, i) of month.dates" :key="week[0].day + '' + week[0].month"
                                            v-bind="ptm('tableBodyRow')">
                                            <td v-if="showWeek" :class="cx('weekNumber')" v-bind="ptm('weekNumber')"
                                                data-pc-group-section="tablebodycell">
                                                <span :class="cx('weekLabelContainer')"
                                                    v-bind="ptm('weekLabelContainer', { context: { disabled: showWeek } })"
                                                    :data-p-disabled="showWeek"
                                                    data-pc-group-section="tablebodycelllabel">
                                                    <slot name="weeklabel" :weekNumber="month.weekNumbers[i]">
                                                        <span v-if="month.weekNumbers[i] < 10"
                                                            style="visibility: hidden"
                                                            v-bind="ptm('weekLabel')">0</span>
                                                        {{ month.weekNumbers[i] }}
                                                    </slot>
                                                </span>
                                            </td>
                                            <td v-for="date of week" :key="date.day + '' + date.month"
                                                :aria-label="date.day" :class="cx('dayCell', { date })" v-bind="ptm('dayCell', {
                                                    context: {
                                                        date,
                                                        today: date.today,
                                                        otherMonth: date.otherMonth,
                                                        selected: isSelected(date),
                                                        disabled: !date.selectable
                                                    }
                                                })
                                                    " :data-p-today="date.today" :data-p-other-month="date.otherMonth"
                                                data-pc-group-section="tablebodycell">
                                                <span v-if="showOtherMonths || !date.otherMonth" v-ripple
                                                    :class="cx('day', { date })" @click="onDateSelect($event, date)"
                                                    draggable="false" :aria-selected="isSelected(date)"
                                                    :aria-disabled="!date.selectable" v-bind="ptm('day', {
                                                        context: {
                                                            date,
                                                            today: date.today,
                                                            otherMonth: date.otherMonth,
                                                            selected: isSelected(date),
                                                            disabled: !date.selectable
                                                        }
                                                    })
                                                        " :data-p-disabled="!date.selectable"
                                                    :data-p-selected="isSelected(date)"
                                                    data-pc-group-section="tablebodycelllabel">
                                                    <slot name="date" :date="date">{{ date.day }}</slot>
                                                </span>
                                                <div v-if="isSelected(date)" class="p-hidden-accessible"
                                                    aria-live="polite" v-bind="ptm('hiddenSelectedDay')"
                                                    :data-p-hidden-accessible="true">
                                                    {{ date.day }}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div v-if="currentView === 'month'" :class="cx('monthView')" v-bind="ptm('monthView')">
                            <span v-for="(m, i) of monthPickerValues" :key="m" v-ripple
                                @click="onMonthSelect($event, { month: m, index: i })"
                                :class="cx('month', { month: m, index: i })" v-bind="ptm('month', {
                                    context: {
                                        month: m,
                                        monthIndex: i,
                                        selected: isMonthSelected(i),
                                        disabled: !m.selectable
                                    }
                                })
                                    " :data-p-disabled="!m.selectable" :data-p-selected="isMonthSelected(i)">
                                {{ m.value }}
                                <div v-if="isMonthSelected(i)" class="p-hidden-accessible" aria-live="polite"
                                    v-bind="ptm('hiddenMonth')" :data-p-hidden-accessible="true">
                                    {{ m.value }}
                                </div>
                            </span>
                        </div>
                        <div v-if="currentView === 'year'" :class="cx('yearView')" v-bind="ptm('yearView')">
                            <span v-for="y of yearPickerValues" :key="y.value" v-ripple @click="onYearSelect($event, y)"
                                :class="cx('year', { year: y })" v-bind="ptm('year', {
                                    context: {
                                        year: y,
                                        selected: isYearSelected(y.value),
                                        disabled: !y.selectable
                                    }
                                })
                                    " :data-p-disabled="!y.selectable" :data-p-selected="isYearSelected(y.value)">
                                {{ y.value }}
                                <div v-if="isYearSelected(y.value)" class="p-hidden-accessible" aria-live="polite"
                                    v-bind="ptm('hiddenYear')" :data-p-hidden-accessible="true">
                                    {{ y.value }}
                                </div>
                            </span>
                        </div>
                    </template>
                    <div v-if="(showTime || timeOnly) && currentView === 'date'" :class="cx('timePicker')"
                        v-bind="ptm('timePicker')">
                        <div :class="cx('hourPicker')" v-bind="ptm('hourPicker')"
                            data-pc-group-section="timepickerContainer">
                            <Button :class="cx('pcIncrementButton')" :aria-label="$primevue.config.locale.nextHour"
                                :unstyled="unstyled" @mousedown="onTimePickerElementMouseDown($event, 0, -1)"
                                @mouseup="onTimePickerElementMouseUp($event)"
                                @mouseleave="onTimePickerElementMouseLeave()" v-bind="timepickerButtonProps"
                                :pt="ptm('pcIncrementButton')" data-pc-group-section="timepickerbutton">
                                <template #icon="slotProps">
                                    <slot name="incrementicon">
                                        <component :is="incrementIcon ? 'span' : 'ChevronUpIcon'"
                                            :class="[incrementIcon, slotProps.class]"
                                            v-bind="ptm('pcIncrementButton')['icon']"
                                            data-pc-group-section="timepickerlabel" />
                                    </slot>
                                </template>
                            </Button>
                            <span v-bind="ptm('hour')" data-pc-group-section="timepickerlabel">{{ formattedCurrentHour
                                }}</span>
                            <Button :class="cx('pcDecrementButton')" :aria-label="$primevue.config.locale.prevHour"
                                :unstyled="unstyled" @mousedown="onTimePickerElementMouseDown($event, 0, 1)"
                                @mouseup="onTimePickerElementMouseUp($event)"
                                @mouseleave="onTimePickerElementMouseLeave()" v-bind="timepickerButtonProps"
                                :pt="ptm('pcDecrementButton')" data-pc-group-section="timepickerbutton">
                                <template #icon="slotProps">
                                    <slot name="decrementicon">
                                        <component :is="decrementIcon ? 'span' : 'ChevronDownIcon'"
                                            :class="[decrementIcon, slotProps.class]"
                                            v-bind="ptm('pcDecrementButton')['icon']"
                                            data-pc-group-section="timepickerlabel" />
                                    </slot>
                                </template>
                            </Button>
                        </div>
                        <div v-bind="ptm('separatorContainer')" data-pc-group-section="timepickerContainer">
                            <span v-bind="ptm('separator')" data-pc-group-section="timepickerlabel">{{ timeSeparator
                                }}</span>
                        </div>
                        <div :class="cx('minutePicker')" v-bind="ptm('minutePicker')"
                            data-pc-group-section="timepickerContainer">
                            <Button :class="cx('pcIncrementButton')" :aria-label="$primevue.config.locale.nextMinute"
                                :disabled="disabled" :unstyled="unstyled"
                                @mousedown="onTimePickerElementMouseDown($event, 1, -1)"
                                @mouseup="onTimePickerElementMouseUp($event)"
                                @mouseleave="onTimePickerElementMouseLeave()" v-bind="timepickerButtonProps"
                                :pt="ptm('pcIncrementButton')" data-pc-group-section="timepickerbutton">
                                <template #icon="slotProps">
                                    <slot name="incrementicon">
                                        <component :is="incrementIcon ? 'span' : 'ChevronUpIcon'"
                                            :class="[incrementIcon, slotProps.class]"
                                            v-bind="ptm('pcIncrementButton')['icon']"
                                            data-pc-group-section="timepickerlabel" />
                                    </slot>
                                </template>
                            </Button>
                            <span v-bind="ptm('minute')" data-pc-group-section="timepickerlabel">{{
                                formattedCurrentMinute }}</span>
                            <Button :class="cx('pcDecrementButton')" :aria-label="$primevue.config.locale.prevMinute"
                                :disabled="disabled" @mousedown="onTimePickerElementMouseDown($event, 1, 1)"
                                @mouseup="onTimePickerElementMouseUp($event)"
                                @mouseleave="onTimePickerElementMouseLeave()" v-bind="timepickerButtonProps"
                                :pt="ptm('pcDecrementButton')" data-pc-group-section="timepickerbutton">
                                <template #icon="slotProps">
                                    <slot name="decrementicon">
                                        <component :is="decrementIcon ? 'span' : 'ChevronDownIcon'"
                                            :class="[decrementIcon, slotProps.class]"
                                            v-bind="ptm('pcDecrementButton')['icon']"
                                            data-pc-group-section="timepickerlabel" />
                                    </slot>
                                </template>
                            </Button>
                        </div>
                        <div v-if="showSeconds" :class="cx('separatorContainer')" v-bind="ptm('separatorContainer')"
                            data-pc-group-section="timepickerContainer">
                            <span v-bind="ptm('separator')" data-pc-group-section="timepickerlabel">{{ timeSeparator
                                }}</span>
                        </div>
                        <div v-if="showSeconds" :class="cx('secondPicker')" v-bind="ptm('secondPicker')"
                            data-pc-group-section="timepickerContainer">
                            <Button :class="cx('pcIncrementButton')" :aria-label="$primevue.config.locale.nextSecond"
                                :disabled="disabled" :unstyled="unstyled"
                                @mousedown="onTimePickerElementMouseDown($event, 2, -1)"
                                @mouseup="onTimePickerElementMouseUp($event)"
                                @mouseleave="onTimePickerElementMouseLeave()" v-bind="timepickerButtonProps"
                                :pt="ptm('pcIncrementButton')" data-pc-group-section="timepickerbutton">
                                <template #icon="slotProps">
                                    <slot name="incrementicon">
                                        <component :is="incrementIcon ? 'span' : 'ChevronUpIcon'"
                                            :class="[incrementIcon, slotProps.class]"
                                            v-bind="ptm('pcIncrementButton')['icon']"
                                            data-pc-group-section="timepickerlabel" />
                                    </slot>
                                </template>
                            </Button>
                            <span v-bind="ptm('second')" data-pc-group-section="timepickerlabel">{{
                                formattedCurrentSecond }}</span>
                            <Button :class="cx('pcDecrementButton')" :aria-label="$primevue.config.locale.prevSecond"
                                :disabled="disabled" :unstyled="unstyled"
                                @mousedown="onTimePickerElementMouseDown($event, 2, 1)"
                                @mouseup="onTimePickerElementMouseUp($event)"
                                @mouseleave="onTimePickerElementMouseLeave()" v-bind="timepickerButtonProps"
                                :pt="ptm('pcDecrementButton')" data-pc-group-section="timepickerbutton">
                                <template #icon="slotProps">
                                    <slot name="decrementicon">
                                        <component :is="decrementIcon ? 'span' : 'ChevronDownIcon'"
                                            :class="[decrementIcon, slotProps.class]"
                                            v-bind="ptm('pcDecrementButton')['icon']"
                                            data-pc-group-section="timepickerlabel" />
                                    </slot>
                                </template>
                            </Button>
                        </div>
                    </div>
                    <div class="flex flex-row justify-end align-items-center border-t-2 pt-3">
                        <Button size="Small" @click="clickToSave" icon="pi pi-check" aria-label="Filter"
                            class="m-2 py-0.5" />
                        <Button size="Small" @click="clickToCancel" icon="pi pi-times" severity="danger"
                            aria-label="Cancel" class="m-2 py-0.5" />
                    </div>
                </div>
            </transition>
        </Portal>
    </span>
</template>

<script>
import { absolutePosition, addStyle, find, findSingle, getAttribute, getFocusableElements, getIndex, getOuterWidth, isTouchDevice, relativePosition, setAttribute } from '@primeuix/utils/dom';
import { ConnectedOverlayScrollHandler, UniqueComponentId } from '@primevue/core/utils';
import { ZIndex } from '@primeuix/utils/zindex';
import InputText from 'primevue/inputtext';
import CalendarIcon from '@primevue/icons/calendar';
import ChevronDownIcon from '@primevue/icons/chevrondown';
import ChevronLeftIcon from '@primevue/icons/chevronleft';
import ChevronRightIcon from '@primevue/icons/chevronright';
import ChevronUpIcon from '@primevue/icons/chevronup';
import BasePicker from './BasePicker.vue';
import Portal from 'primevue/portal';
import * as _ from "lodash"

export default {
    name: 'MyDatepicker',
    extends: BasePicker,
    navigationState: null,
    timePickerChange: false,
    scrollHandler: null,
    outsideClickListener: null,
    resizeListener: null,
    matchMediaListener: null,
    overlay: null,
    input: null,
    previousButton: null,
    nextButton: null,
    timePickerTimer: null,
    preventFocus: false,
    typeUpdate: false,
    data() {
        return {
            d_id: this.id,
            currentMonth: null,
            currentYear: null,
            currentHour: null,
            currentMinute: null,
            currentSecond: null,
            inputFieldValue: "",
            focused: false,
            isClosed: true,
            overlayVisible: false,
            currentView: this.view,
        };
    },
    props: {
        date: Date,
    },
    components: {
        Portal,
        CalendarIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
        ChevronUpIcon,
        ChevronDownIcon
    },
    created() {
        this.d_value = this.date
        this.inputFieldValue = this.formatDateTime(this.date);
        this.updateCurrentMetaData();
    },
    mounted() {
        this.d_id = this.d_id || UniqueComponentId();

        if (this.inline) {
            if (!this.disabled) {
                this.preventFocus = true;
                this.initFocusableCell();
            }
        } else {
            this.input.value = this.inputFieldValue;
        }
    },
    methods: {
        overlayRef(el) {
            this.overlay = el;
        },
        inputRef(el) {
            this.input = el ? el.$el : undefined;
        },
        previousButtonRef(el) {
            this.previousButton = el ? el.$el : undefined;
        },
        nextButtonRef(el) {
            this.nextButton = el ? el.$el : undefined;
        },
        isEnabled() {
            return !this.disabled && !this.readonly;
        },

        //update
        updateCurrentMetaData() {
            const viewDate = this.d_value;

            this.currentMonth = viewDate.getMonth();
            this.currentYear = viewDate.getFullYear();

            if (this.showTime || this.timeOnly) {
                this.updateCurrentTimeMeta(viewDate);
            }
        },
        updateCurrentTimeMeta(date) {
            let currentHour = date.getHours();

            this.currentHour = Math.floor(currentHour / this.stepHour) * this.stepHour;
            this.currentMinute = Math.floor(date.getMinutes() / this.stepMinute) * this.stepMinute;
            this.currentSecond = Math.floor(date.getSeconds() / this.stepSecond) * this.stepSecond;
        },
        updateModelTime() {
            this.timePickerChange = true;
            let value = this.d_value;
 
            value.setHours(this.currentHour);
            value.setMinutes(this.currentMinute);
            value.setSeconds(this.currentSecond);

            this.updateModel(value);
            setTimeout(() => (this.timePickerChange = false), 0);
        },
        updateModel(value) {
            this.writeValue(value);
        },


        onInputClick() {
            if (this.showOnFocus && this.isEnabled() && !this.overlayVisible) {
                this.overlayVisible = true;
            }
        },
        onInput: _.debounce(function (event) {
            event.target.value = this.inputFieldValue;
        }, 150),
        onOverlayEnter(el) {
            const styles = this.inline ? {} : { position: 'absolute', top: '0', left: '0' };

            addStyle(el, styles);

            if (this.autoZIndex) {
                ZIndex.set('overlay', el, this.baseZIndex || this.$primevue.config.zIndex?.overlay);
            }

            this.alignOverlay();
        },
        alignOverlay() {
            if (this.overlay) {
                if (this.appendTo === 'self' || this.inline) {
                    relativePosition(this.overlay, this.$el);
                } else {
                    if (this.view === 'date') {
                        this.overlay.style.width = getOuterWidth(this.overlay) + 'px';
                        this.overlay.style.minWidth = getOuterWidth(this.$el) + 'px';
                    } else {
                        this.overlay.style.width = getOuterWidth(this.$el) + 'px';
                    }

                    absolutePosition(this.overlay, this.$el);
                }
            }
        },
        onOverlayEnterComplete() {
            this.bindOutsideClickListener();
            this.bindScrollListener();
            this.bindResizeListener();
            this.updateCurrentMetaData();
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.overlayVisible && this.isOutsideClicked(event)) {
                        this.overlayVisible = false;
                    }
                };

                document.addEventListener('mousedown', this.outsideClickListener);
            }
        },
        unbindOutsideClickListener() {
            if (this.outsideClickListener) {
                document.removeEventListener('mousedown', this.outsideClickListener);
                this.outsideClickListener = null;
            }
        },
        onOverlayAfterLeave(el) {
            if (this.autoZIndex) {
                ZIndex.clear(el);
            }
            this.d_value = this.date;

        },
        bindScrollListener() {
            if (!this.scrollHandler) {
                this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container, () => {
                    if (this.overlayVisible) {
                        this.overlayVisible = false;
                    }
                });
            }

            this.scrollHandler.bindScrollListener();
        },
        unbindScrollListener() {
            if (this.scrollHandler) {
                this.scrollHandler.unbindScrollListener();
            }
        },
        bindResizeListener() {
            if (!this.resizeListener) {
                this.resizeListener = () => {
                    if (this.overlayVisible && !isTouchDevice()) {
                        this.overlayVisible = false;
                    }
                };

                window.addEventListener('resize', this.resizeListener);
            }
        },
        unbindResizeListener() {
            if (this.resizeListener) {
                window.removeEventListener('resize', this.resizeListener);
                this.resizeListener = null;
            }
        },
        onOverlayLeave() {
            this.currentView = this.view;
            this.unbindOutsideClickListener();
            this.unbindScrollListener();
            this.unbindResizeListener();

            this.overlay = null;
        },
        onBlur(event) {
            this.formField.onBlur?.();

            this.focused = false;
        },
        isOutsideClicked(event) {
            return !(this.$el.isSameNode(event.target) || this.isNavIconClicked(event) || this.$el.contains(event.target) || (this.overlay && this.overlay.contains(event.target)));
        },
        isNavIconClicked(event) {
            return (this.previousButton && (this.previousButton.isSameNode(event.target) || this.previousButton.contains(event.target))) || (this.nextButton && (this.nextButton.isSameNode(event.target) || this.nextButton.contains(event.target)));
        },
        onPrevButtonClick(event) {
            this.navigationState = { backward: true, button: true };
            this.navBackward(event);
        },
        onNextButtonClick(event) {
            this.navigationState = { backward: false, button: true };
            this.navForward(event);
        },
        navBackward(event) {
            event.preventDefault();

            if (!this.isEnabled()) {
                return;
            }

            if (this.currentView === 'month') {
                this.decrementYear();
            } else if (this.currentView === 'year') {
                this.decrementDecade();
            } else {
                if (event.shiftKey) {
                    this.decrementYear();
                } else {
                    if (this.currentMonth === 0) {
                        this.currentMonth = 11;
                        this.decrementYear();
                    } else {
                        this.currentMonth--;
                    }
                }
            }
        },
        navForward(event) {
            event.preventDefault();

            if (!this.isEnabled()) {
                return;
            }

            if (this.currentView === 'month') {
                this.incrementYear();
            } else if (this.currentView === 'year') {
                this.incrementDecade();
            } else {
                if (event.shiftKey) {
                    this.incrementYear();
                } else {
                    if (this.currentMonth === 11) {
                        this.currentMonth = 0;
                        this.incrementYear();
                    } else {
                        this.currentMonth++;
                    }
                }
            }
        },
        destroyResponsiveStyleElement() {
            if (this.responsiveStyleElement) {
                this.responsiveStyleElement.remove();
                this.responsiveStyleElement = null;
            }
        },

        //date
        getFirstDayOfMonthIndex(month, year) {
            let day = new Date();

            day.setDate(1);
            day.setMonth(month);
            day.setFullYear(year);

            let dayIndex = day.getDay() + this.sundayIndex;

            return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
        },
        getDaysCountInMonth(month, year) {
            return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
        },
        getDaysCountInPrevMonth(month, year) {
            let prev = this.getPreviousMonthAndYear(month, year);

            return this.getDaysCountInMonth(prev.month, prev.year);
        },
        getPreviousMonthAndYear(month, year) {
            let m, y;

            if (month === 0) {
                m = 11;
                y = year - 1;
            } else {
                m = month - 1;
                y = year;
            }

            return { month: m, year: y };
        },
        getNextMonthAndYear(month, year) {
            let m, y;

            if (month === 11) {
                m = 0;
                y = year + 1;
            } else {
                m = month + 1;
                y = year;
            }

            return { month: m, year: y };
        },
        daylightSavingAdjust(date) {
            if (!date) {
                return null;
            }

            date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);

            return date;
        },
        getMonthName(index) {
            return this.$primevue.config.locale.monthNames[index];
        },
        getYear(month) {
            return this.currentView === 'month' ? this.currentYear : month.year;
        },
        onMonthSelect(event, { month, index }) {
            if (this.view === 'month') {
                this.onDateSelect(event, { year: this.currentYear, month: index, day: 1, selectable: true });
            } else {
                this.currentMonth = index;
                this.currentView = 'date';
            }

            setTimeout(this.updateFocus, 0);
        },
        onYearSelect(event, year) {
            if (this.view === 'year') {
                this.onDateSelect(event, { year: year.value, month: 0, day: 1, selectable: true });
            } else {
                this.currentYear = year.value;
                this.currentView = 'month';
            }

            setTimeout(this.updateFocus, 0);
        },
        onDateSelect(event, dateMeta) {
            if (this.disabled || !dateMeta.selectable) {
                return;
            }
            find(this.overlay, 'table td span:not([data-p-disabled="true"])').forEach((cell) => (cell.tabIndex = -1));

            if (event) {
                event.currentTarget.focus();
            }

            if (dateMeta.otherMonth) {
                this.currentMonth = dateMeta.month;
                this.currentYear = dateMeta.year;
                this.selectDate(dateMeta);
            } else {
                this.selectDate(dateMeta);
            }

            if (this.isSingleSelection() && (!this.showTime || this.hideOnDateTimeSelect)) {
                if (this.input) {
                    this.input.focus();
                }

                setTimeout(() => {
                    this.overlayVisible = false;
                }, 150);
            }
        },
        switchToMonthView(event) {
            this.currentView = 'month';
            setTimeout(this.updateFocus, 0);
            event.preventDefault();
        },
        switchToYearView(event) {
            this.currentView = 'year';
            setTimeout(this.updateFocus, 0);
            event.preventDefault();
        },
        decrementYear() {
            this.currentYear--;
        },
        decrementDecade() {
            this.currentYear = this.currentYear - 10;
        },
        incrementYear() {
            this.currentYear++;
        },
        incrementDecade() {
            this.currentYear = this.currentYear + 10;
        },

        // time
        onTimePickerElementMouseDown(event, type, direction) {
            if (this.isEnabled()) {
                this.repeat(event, null, type, direction);
                event.preventDefault();
            }
        },
        onTimePickerElementMouseUp(event) {
            if (this.isEnabled()) {
                if (this.timePickerTimer) {
                    clearInterval(this.timePickerTimer);
                }
                this.updateModelTime();
                event.preventDefault();
            }
        },
        onTimePickerElementMouseLeave() {
            if (this.timePickerTimer) {
                clearInterval(this.timePickerTimer);
            }
        },
        repeat(event, interval, type, direction) {
            let i = interval || 500;

            if (this.timePickerTimer) {
                clearInterval(this.timePickerTimer);
            }
            this.timePickerTimer = setTimeout(() => {
                this.repeat(event, 100, type, direction);
            }, i);

            switch (type) {
                case 0:
                    if (direction === 1) this.incrementHour(event);
                    else this.decrementHour(event);
                    break;

                case 1:
                    if (direction === 1) this.incrementMinute(event);
                    else this.decrementMinute(event);
                    break;

                case 2:
                    if (direction === 1) this.incrementSecond(event);
                    else this.decrementSecond(event);
                    break;
            }
        },
        incrementHour(event) {
            let prevHour = this.currentHour;
            let newHour = this.currentHour + Number(this.stepHour);

            newHour = newHour >= 24 ? newHour - 24 : newHour;

            this.currentHour = newHour;

            event.preventDefault();
        },
        decrementHour(event) {
            let newHour = this.currentHour - this.stepHour;

            newHour = newHour < 0 ? 24 + newHour : newHour;

            this.currentHour = newHour;

            event.preventDefault();
        },
        incrementMinute(event) {
            let newMinute = this.currentMinute + Number(this.stepMinute);

            this.currentMinute = newMinute > 59 ? newMinute - 60 : newMinute;

            event.preventDefault();
        },
        decrementMinute(event) {
            let newMinute = this.currentMinute - this.stepMinute;

            newMinute = newMinute < 0 ? 60 + newMinute : newMinute;

            this.currentMinute = newMinute;

            event.preventDefault();
        },
        incrementSecond(event) {
            let newSecond = this.currentSecond + Number(this.stepSecond);

            this.currentSecond = newSecond > 59 ? newSecond - 60 : newSecond;

            event.preventDefault();
        },
        decrementSecond(event) {
            let newSecond = this.currentSecond - this.stepSecond;

            newSecond = newSecond < 0 ? 60 + newSecond : newSecond;

            this.currentSecond = newSecond;

            event.preventDefault();
        },

        isToday(today, day, month, year) {
            return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
        },
        isSelected(dateMeta) {

            if (this.d_value) {
                return this.isDateEquals(this.d_value, dateMeta);
            }

            return false;
        },
        isMonthSelected(month) {
            return this.d_value.getMonth() === month && this.d_value.getFullYear() === this.currentYear;
        },
        isYearSelected(year) {
            return this.d_value.getFullYear() === year;
        },
        isDateEquals(value, dateMeta) {
            if (value) return value.getDate() === dateMeta.day && value.getMonth() === dateMeta.month && value.getFullYear() === dateMeta.year;
            else return false;
        },
        isSingleSelection() {
            return true;
        },
        isRangeSelection() {
            return false;
        },
        isMultipleSelection() {
            return false;
        },
        selectDate(dateMeta) {
            let date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);

            if (this.showTime) {
                date.setHours(this.currentHour);
                date.setMinutes(this.currentMinute);
                date.setSeconds(this.currentSecond);
            }

            let modelVal = date;
            this.updateModel(modelVal);
        },

        clickToSave() {

        },
        clickToCancel() {
            this.overlayVisible =false;
        },


        formatValue(value) {
            if (typeof value === 'string') {
                return value;
            }

            let formattedValue = '';

            if (value) {
                try {
                    formattedValue = this.formatDateTime(value);
                } catch (err) {
                    formattedValue = value;
                }
            }

            return formattedValue;
        },
        formatDateTime(date) {
            let formattedValue = null;

            if (date) {
                if (this.timeOnly) {
                    formattedValue = this.formatTime(date);
                } else {
                    formattedValue = this.formatDate(date, this.datePattern);

                    if (this.showTime) {
                        formattedValue += ' ' + this.formatTime(date);
                    }
                }
            }

            return formattedValue;
        },
        formatDate(date, format) {
            if (!date) {
                return '';
            }

            let iFormat;

            const lookAhead = (match) => {
                const matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;

                if (matches) {
                    iFormat++;
                }

                return matches;
            },
                formatNumber = (match, value, len) => {
                    let num = '' + value;

                    if (lookAhead(match)) {
                        while (num.length < len) {
                            num = '0' + num;
                        }
                    }

                    return num;
                },
                formatName = (match, value, shortNames, longNames) => {
                    return lookAhead(match) ? longNames[value] : shortNames[value];
                };

            let output = '';
            let literal = false;

            if (date) {
                for (iFormat = 0; iFormat < format.length; iFormat++) {
                    if (literal) {
                        if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                            literal = false;
                        } else {
                            output += format.charAt(iFormat);
                        }
                    } else {
                        switch (format.charAt(iFormat)) {
                            case 'd':
                                output += formatNumber('d', date.getDate(), 2);
                                break;
                            case 'D':
                                output += formatName('D', date.getDay(), this.$primevue.config.locale.dayNamesShort, this.$primevue.config.locale.dayNames);
                                break;
                            case 'o':
                                output += formatNumber('o', Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                                break;
                            case 'm':
                                output += formatNumber('m', date.getMonth() + 1, 2);
                                break;
                            case 'M':
                                output += formatName('M', date.getMonth(), this.$primevue.config.locale.monthNamesShort, this.$primevue.config.locale.monthNames);
                                break;
                            case 'y':
                                output += lookAhead('y') ? date.getFullYear() : (date.getFullYear() % 100 < 10 ? '0' : '') + (date.getFullYear() % 100);
                                break;
                            case '@':
                                output += date.getTime();
                                break;
                            case '!':
                                output += date.getTime() * 10000 + this.ticksTo1970;
                                break;
                            case "'":
                                if (lookAhead("'")) {
                                    output += "'";
                                } else {
                                    literal = true;
                                }

                                break;
                            default:
                                output += format.charAt(iFormat);
                        }
                    }
                }
            }

            return output;
        },
        formatTime(date) {
            if (!date) {
                return '';
            }

            let output = '';
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();

            output += hours < 10 ? '0' + hours : hours;

            output += ':';
            output += minutes < 10 ? '0' + minutes : minutes;

            if (this.showSeconds) {
                output += ':';
                output += seconds < 10 ? '0' + seconds : seconds;
            }

            return output;
        },
    },
    watch: {

    },
    computed: {
        formattedCurrentHour() {
            return this.currentHour < 10 ? '0' + this.currentHour : this.currentHour;
        },
        formattedCurrentMinute() {
            return this.currentMinute < 10 ? '0' + this.currentMinute : this.currentMinute;
        },
        formattedCurrentSecond() {
            return this.currentSecond < 10 ? '0' + this.currentSecond : this.currentSecond;
        },
        datePattern() {
            return this.dateFormat || this.$primevue.config.locale.dateFormat;
        },
        months() {
            let months = [];

            for (let i = 0; i < this.numberOfMonths; i++) {
                let month = this.currentMonth + i;
                let year = this.currentYear;

                if (month > 11) {
                    month = (month % 11) - 1;
                    year = year + 1;
                }

                let dates = [];

                let firstDay = this.getFirstDayOfMonthIndex(month, year);
                let daysLength = this.getDaysCountInMonth(month, year);
                let prevMonthDaysLength = this.getDaysCountInPrevMonth(month, year);
                let dayNo = 1;
                let today = this.date;
                let weekNumbers = [];
                let monthRows = Math.ceil((daysLength + firstDay) / 7);

                for (let i = 0; i < monthRows; i++) {
                    let week = [];

                    if (i == 0) {
                        for (let j = prevMonthDaysLength - firstDay + 1; j <= prevMonthDaysLength; j++) {
                            let prev = this.getPreviousMonthAndYear(month, year);

                            week.push({ day: j, month: prev.month, year: prev.year, otherMonth: true, today: this.isToday(today, j, prev.month, prev.year) });
                        }

                        let remainingDaysLength = 7 - week.length;

                        for (let j = 0; j < remainingDaysLength; j++) {
                            week.push({ day: dayNo, month: month, year: year, today: this.isToday(today, dayNo, month, year), selectable: true });
                            dayNo++;
                        }
                    } else {
                        for (let j = 0; j < 7; j++) {
                            if (dayNo > daysLength) {
                                let next = this.getNextMonthAndYear(month, year);

                                week.push({
                                    day: dayNo - daysLength,
                                    month: next.month,
                                    year: next.year,
                                    otherMonth: true,
                                    today: this.isToday(today, dayNo - daysLength, next.month, next.year),
                                    selectable: false
                                });
                            } else {
                                week.push({ day: dayNo, month: month, year: year, today: this.isToday(today, dayNo, month, year), selectable: true });
                            }

                            dayNo++;
                        }
                    }

                    if (this.showWeek) {
                        weekNumbers.push(this.getWeekNumber(new Date(week[0].year, week[0].month, week[0].day)));
                    }

                    dates.push(week);
                }

                months.push({
                    month: month,
                    year: year,
                    dates: dates,
                    weekNumbers: weekNumbers
                });
            }
            return months;
        },
        weekDays() {
            let weekDays = [];
            let dayIndex = this.$primevue.config.locale.firstDayOfWeek;

            for (let i = 0; i < 7; i++) {
                weekDays.push(this.$primevue.config.locale.dayNamesMin[dayIndex]);
                dayIndex = dayIndex == 6 ? 0 : ++dayIndex;
            }
            return weekDays;
        },
        sundayIndex() {
            return this.$primevue.config.locale.firstDayOfWeek > 0 ? 7 - this.$primevue.config.locale.firstDayOfWeek : 0;
        },
        monthPickerValues() {
            let monthPickerValues = [];

            for (let i = 0; i <= 11; i++) {
                monthPickerValues.push({ value: this.$primevue.config.locale.monthNamesShort[i], selectable: true });
            }
            return monthPickerValues;
        },
        yearPickerValues() {
            let yearPickerValues = [];
            let base = this.currentYear - (this.currentYear % 10);

            for (let i = 0; i < 10; i++) {
                yearPickerValues.push({ value: base + i, selectable: true });
            }

            return yearPickerValues;
        },
    },
    beforeUnmount() {
        if (this.timePickerTimer) {
            clearTimeout(this.timePickerTimer);
        }

        this.destroyResponsiveStyleElement();
        this.unbindOutsideClickListener();
        this.unbindResizeListener();
        this.unbindMatchMediaListener();

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        if (this.overlay && this.autoZIndex) {
            ZIndex.clear(this.overlay);
        }

        this.overlay = null;
    },
}
</script>

<style lang='css' scoped></style>