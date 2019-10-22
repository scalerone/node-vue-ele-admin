<template>
    <div class="index">
        <HeadNav></HeadNav>
    </div>
</template>
<script>
    import HeadNav from "../components/HeadNav";
    export default {
        name: "index",
        components: {
            HeadNav
        }
    };
</script>


<style>
    .index {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
