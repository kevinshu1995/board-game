<template>
    <div class="flex flex-col gap-2">
        <nav aria-label="Page navigation" class="flex justify-center">
            <ul class="inline-flex items-center -space-x-px">
                <li>
                    <a
                        href="#"
                        @click.prevent="prev"
                        :disabled="isFirstPage"
                        :class="[...disabledOrNotBtnClass(isFirstPage), 'block ml-0 rounded-l-lg']"
                    >
                        <span class="sr-only">Previous</span>
                        <Icon name="chevron-left" class="w-5 h-[18px]" />
                    </a>
                </li>
                <!-- "..." & go first page -->
                <template v-if="!renderedPageBtns.isAlignLeft">
                    <li>
                        <a href="#" @click.prevent="currentPage = 1" :class="normalBtnClass">
                            {{ 1 }}
                        </a>
                    </li>
                    <li>
                        <a href="#" @click.prevent="() => {}" :class="disabledBtnClass"> ... </a>
                    </li>
                </template>
                <li v-for="page in renderedPageBtns.btnArray">
                    <a
                        href="#"
                        @click.prevent="currentPage = page"
                        :class="activeOrNotBtnClass(page === currentPage)"
                    >
                        {{ page }}
                    </a>
                </li>
                <!-- "..." & go last page -->
                <template v-if="!renderedPageBtns.isAlignRight">
                    <li>
                        <a href="#" @click.prevent="() => {}" :class="disabledBtnClass"> ... </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            @click.prevent="currentPage = pageCount"
                            :class="normalBtnClass"
                        >
                            {{ pageCount }}
                        </a>
                    </li>
                </template>
                <li>
                    <a
                        href="#"
                        @click.prevent="next"
                        :disabled="isLastPage"
                        :class="[...disabledOrNotBtnClass(isLastPage), 'block ml-0 rounded-r-lg']"
                    >
                        <span class="sr-only">Next</span>
                        <Icon name="chevron-right" class="w-5 h-[18px]" />
                    </a>
                </li>
            </ul>
        </nav>
        <!-- <div
            class="text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center justify-center gap-1"
        >
            <p>共 {{ pageCount }} 頁 / 共 {{ props.total }} 筆資料</p>
            <p>每頁 {{ currentPageSize }} 筆</p>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useOffsetPagination } from "@vueuse/core";

const props = defineProps<{
    total: number;
    page: number;
    pageSize: number;
    pageButtons?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (currentPageSize: number) => void;
}>();

const pageButtons = computed(() => {
    return props.pageButtons || 5;
});

const { currentPage, currentPageSize, pageCount, isFirstPage, isLastPage, prev, next } =
    useOffsetPagination({
        total: props.total,
        page: props.page,
        pageSize: props.pageSize,
        onPageChange: () => {
            if (props.onPageChange) {
                props.onPageChange(currentPage.value);
            }
        },
        onPageSizeChange: () => {
            if (props.onPageSizeChange) {
                props.onPageSizeChange(currentPageSize.value);
            }
        },
    });

// it returns page, not page "index"
const renderedPageBtns = computed<{
    btnArray: number[];
    isAlignLeft: boolean;
    isAlignRight: boolean;
}>(() => {
    let pageRange = null;

    const leftShouldHaveBtnCounts = Math.floor(pageButtons.value / 2);
    const RightShouldHaveBtnCounts = pageButtons.value - leftShouldHaveBtnCounts - 1;

    // 左邊不夠的狀況
    if (leftShouldHaveBtnCounts > currentPage.value - 1) {
        pageRange = {
            left: 1,
            right: Math.min(pageButtons.value, pageCount.value),
        };
    }
    // 右邊不夠的狀況
    else if (RightShouldHaveBtnCounts + currentPage.value > pageCount.value) {
        pageRange = {
            left: pageCount.value - pageButtons.value + 1,
            right: pageCount.value,
        };
    }
    // 兩邊都夠的情況
    else {
        pageRange = {
            left: currentPage.value - leftShouldHaveBtnCounts,
            right: currentPage.value + RightShouldHaveBtnCounts,
        };
    }

    return {
        btnArray: [...Array(pageRange.right + 1).keys()].slice(pageRange.left),
        isAlignLeft: pageRange.left <= 1,
        isAlignRight: pageRange.right >= pageCount.value,
    };
});

const buttonClasses = {
    baseTheme: "leading-tight border dark:border-gray-700",
    normalTheme: "bg-white border-gray-300 dark:bg-gray-800",
    notDisabledNormalTheme:
        "text-gray-500 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white",
    activeTheme:
        "z-10 cursor-default text-blue-600 border-blue-300 bg-blue-50 dark:bg-gray-700 dark:text-white",
    disabledStyles: "cursor-default text-gray-700 dark:text-gary-900",
    size: "px-3 py-2",
};

const normalBtnClass = [
    buttonClasses.baseTheme,
    buttonClasses.size,
    buttonClasses.normalTheme,
    buttonClasses.notDisabledNormalTheme,
];

const disabledBtnClass = [
    buttonClasses.baseTheme,
    buttonClasses.size,
    buttonClasses.normalTheme,
    buttonClasses.disabledStyles,
];

const activeOrNotBtnClass = (isActive: boolean): string[] => [
    buttonClasses.baseTheme,
    buttonClasses.size,
    isActive
        ? buttonClasses.activeTheme
        : [buttonClasses.normalTheme, buttonClasses.notDisabledNormalTheme].join(" "),
];

const disabledOrNotBtnClass = (isDisabled: boolean): string[] => [
    isDisabled ? buttonClasses.disabledStyles : buttonClasses.notDisabledNormalTheme,
    buttonClasses.size,
    buttonClasses.baseTheme,
    buttonClasses.normalTheme,
];
</script>

