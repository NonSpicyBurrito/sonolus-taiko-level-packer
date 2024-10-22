<script setup lang="ts">
import { version } from '@sonolus/core'
import { version as engineVersion } from 'sonolus-taiko-engine'
import { ref } from 'vue'
import { version as appVersion } from '../package.json'
import VLink from './components/VLink.vue'
import VFileField from './components/fields/VFileField.vue'
import VNumberField from './components/fields/VNumberField.vue'
import VSelectField from './components/fields/VSelectField.vue'
import VTextAreaField from './components/fields/VTextAreaField.vue'
import VTextField from './components/fields/VTextField.vue'
import { pack } from './packer'

const title = ref('')
const artists = ref('')
const author = ref('')
const rating = ref(0)
const cover = ref<File>()
const bgm = ref<File>()
const preview = ref<File>()
const format = ref<'tja' | 'osu'>('tja')
const chartTja = ref<File>()
const courseId = ref(0)
const chartOsu = ref<File>()
const offset = ref(0)
const description = ref('')

const state = ref<{ type: 'packing' } | { type: 'success' } | { type: 'error'; error: unknown }>()

const onPack = async () => {
    state.value = { type: 'packing' }

    try {
        await pack({
            title: title.value,
            artists: artists.value,
            author: author.value,
            rating: rating.value,
            cover: cover.value,
            bgm: bgm.value,
            preview: preview.value,
            format: format.value,
            chartTja: chartTja.value,
            courseId: courseId.value,
            chartOsu: chartOsu.value,
            offset: offset.value,
            description: description.value,
        })

        state.value = { type: 'success' }

        await new Promise((resolve) => setTimeout(resolve, 2000))

        state.value = undefined
    } catch (error) {
        console.error(error)

        state.value = { type: 'error', error }
    }
}

const onClose = () => {
    state.value = undefined
}
</script>

<template>
    <h1 class="text-center text-xl font-bold sm:text-3xl">Sonolus Taiko Level Packer</h1>

    <p>
        Pack your Taiko no Tatsujin levels into Sonolus collection packages. <br />
        <br />
        Sonolus: <br />
        Version {{ version.sonolus }} <br />
        <VLink url="https://sonolus.com" /> <br />
        <br />
        Engine: <br />
        Version {{ engineVersion }} <br />
        <VLink url="https://github.com/NonSpicyBurrito/sonolus-taiko-engine" /> <br />
        <br />
        Packer: <br />
        Version {{ appVersion }} <br />
        <VLink url="https://github.com/NonSpicyBurrito/sonolus-taiko-level-packer" />
    </p>

    <form @submit.prevent="onPack">
        <div class="flex flex-col gap-4">
            <VTextField
                v-model="title"
                label="Title"
                placeholder="Enter level title..."
                :maxlength="256"
            />

            <VTextField
                v-model="artists"
                label="Artists"
                placeholder="Enter level artists..."
                :maxlength="256"
            />

            <VTextField
                v-model="author"
                label="Author"
                placeholder="Enter level author..."
                :maxlength="256"
            />

            <VNumberField
                v-model="rating"
                label="Rating"
                placeholder="Enter level rating..."
                :min="0"
                :max="10"
                :step="0.01"
                required
            />

            <VFileField v-model="cover" label="Cover" accept="image/*" />

            <VFileField v-model="bgm" label="Bgm" />

            <VFileField v-model="preview" label="Preview" />

            <VSelectField
                v-model="format"
                label="Chart Format"
                :options="{
                    TJA: 'tja',
                    OSU: 'osu',
                }"
                required
            />

            <VFileField
                v-show="format === 'tja'"
                v-model="chartTja"
                label="Chart (TJA)"
                accept=".tja,.txt"
                :required="format === 'tja'"
            />

            <VNumberField
                v-show="format === 'tja'"
                v-model="courseId"
                label="Course ID"
                placeholder="Enter chart course id..."
                :required="format === 'tja'"
            />

            <VFileField
                v-show="format === 'osu'"
                v-model="chartOsu"
                label="Chart (OSU)"
                accept=".osu,.txt"
                :required="format === 'osu'"
            />

            <VNumberField
                v-model="offset"
                label="Offset"
                placeholder="Enter level offset..."
                required
            />

            <VTextAreaField
                v-model="description"
                label="Description"
                placeholder="Enter level description..."
                :maxlength="4096"
            />
        </div>

        <div class="mt-8 flex justify-center">
            <input
                class="min-w-32 bg-button-normal px-2 py-1 font-bold transition-colors hover:bg-button-highlighted focus:outline-none focus:ring-1 focus:ring-text-normal active:bg-button-pressed sm:min-w-36 sm:text-lg"
                type="submit"
                value="Pack"
            />
        </div>
    </form>

    <dialog
        v-if="state"
        :ref="(el) => (el as HTMLDialogElement | null)?.showModal()"
        class="max-w-2xl break-words bg-surface px-12 py-8 text-text-normal backdrop:bg-overlay-main focus:outline-none"
    >
        <p>
            <template v-if="state.type === 'packing'">Packing...</template>
            <template v-else-if="state.type === 'success'">Success, downloading...</template>
            <template v-else>
                Packing failed. <br />
                <br />
                {{ state.error }}
            </template>
        </p>

        <div v-if="state.type !== 'packing'" class="mt-8 flex justify-center">
            <button
                class="w-32 bg-button-normal px-2 py-1 transition-colors hover:bg-button-highlighted focus:outline-none focus:ring-1 focus:ring-text-normal active:bg-button-pressed"
                @click="onClose"
            >
                Close
            </button>
        </div>
    </dialog>
</template>
