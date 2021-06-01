<template>
  <div>
    <div class="blockText">

      <div class="firstText">Что-то пошло не так.</div>
      <div class="secondTex"><span class="textSec">К сожалению у нас проблемы.</span> <br> Попробуйте чуть позже.
      </div>

    </div>
    <div class="mainWrapper">
      <div class="firstWrapper" >
        <a href="https://api.whatsapp.com/send?phone=79243390247&text=" class="linkWrapper">
          <div class="whatsApp">
            <img src="static/img/whatsApp.svg" alt="альтернативный текст">

          </div>
          <div class="WrapperText">
            <div class="fistWrapperText">Написать нам</div>
            <div class="secondWrapperText">+7 (924) 339 - 02 - 47</div>
          </div>
        </a>
      </div>
      <div class="secondWrapper" >
        <a href="tel:+74232218451" class="linkNumber" >
          <div class="number">
            <img src="static/img/number.svg" alt="альтернативный текст">

          </div>
          <div class="WrapperText">
            <div class="fistWrapperText">Позвонить нам</div>
            <div class="secondWrapperText">+7 (423) 221 - 84 - 51</div>
          </div>
        </a>
      </div>

    </div>
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

.blockText {
  text-align: center;
  margin: 1.5rem 0;
}
.firstText {
  font-size: 2.1875rem;
}
.secondTex {
  font-size: 1.125rem;
  margin: 1rem 0;
  line-height: 2rem;
}
.mainWrapper{
  margin-bottom: 2.5156rem;
}
.firstWrapper{
  margin-bottom: 2.5625rem;
}
.whatsApp{
  margin-right: 1.5137rem;
}
.linkWrapper{
  align-items: center;
  display: flex;
  justify-content: center;
  text-decoration: none;
  color: white;
}
.linkNumber{
  align-items: center;
  display: flex;
  justify-content: center;
  text-decoration: none;
  color: white;
}
.number{
  margin-right: 2.1rem;
}
.house{
  background: url("/static/img/houses.svg") no-repeat 50%;
  display: block;
  height: 3rem;
}
</style>
