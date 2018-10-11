<template>
    <div class="rich-rows">
        <div class="rich-row">
            <div class="rich-row__column mobile-collapsed">
                <v-switch id="key"></v-switch>
            </div>
            <div class="rich-row__column rich-row__wide-anchor">
                <div class="rich-row__title">
                    <span class="service-item-color" style="background-color: #da2468"></span>
                    Dashicons is licensed under GPLv2, or any later version with font exception.
                </div>
            </div>
            <div class="rich-row__column">
                <div class="rich-row__header">
                    Sessions
                </div>
                4-8 hours · $90 - $999.99
            </div>
            <div class="rich-row__column rich-row__actions">
                <v-switch id="key" class="mobile-only"></v-switch>
                <div class="button-group">
                    <div class="button">Edit</div>
                    <div class="button button-icon">
                        <span class="dashicons dashicons-arrow-down"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="rich-row">
            <div class="rich-row__column mobile-collapsed">
                <v-switch id="key"></v-switch>
            </div>
            <div class="rich-row__column rich-row__wide-anchor">
                <div class="rich-row__title">
                    <span class="service-item-color" style="background-color: #3672da"></span>
                    Yoga lessons on the hills near bld.
                </div>
            </div>
            <div class="rich-row__column">
                <div class="rich-row__header">
                    Sessions
                </div>
                1-3 hours · $20 - $60
            </div>
            <div class="rich-row__column rich-row__actions">
                <v-switch id="key" class="mobile-only"></v-switch>
                <div class="button-group">
                    <div class="button">Edit</div>
                    <div class="button button-icon">
                        <span class="dashicons dashicons-arrow-down"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    inject: {
      'v-switch': 'v-switch',
    },
    components: {
      'v-switch': 'v-switch',
    }
  }
</script>