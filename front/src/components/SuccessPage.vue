<template>
  <div>
    <div class="blockText">

      <div class="firstText">Спасибо!</div>
      <div class="secondText">Вы участвуйте в розыгрыше путевки!</div>
      <div class="thirdText"><span class="textInstagram">Результаты конкурса смотрие в нашем </span> <br> instagramm
        @zelenyjostrov.ru
      </div>

    </div>
    <a href="https://www.instagram.com/zelenyjostrov.ru/?hl=ru" class="instLink">
      <div class="inst">

      </div>
    </a>
    <div v-on:click="reload" class="house"></div>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  methods: {
    reload () {
      window.location.reload()
    }
  }
}
</script>

<style scoped>

.thirdText{
  font-size: 1.125rem;
  line-height: 2rem;
}
.inst{
  background: url("/static/img/inst.svg") no-repeat 50%;
  display: block;
  height: 3rem;
  margin-bottom: 6rem;
}
.house{
  background: url("/static/img/houses.svg") no-repeat 50%;
  display: block;
  height: 3rem;
}
.instLink{
  display: block;
  width: 4rem;
  margin: 0 auto 6rem auto;
}

</style>
