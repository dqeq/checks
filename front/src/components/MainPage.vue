<template>
  <div v-if="isSuccess">
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
  <div v-else-if="isError">
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
  <div v-else>
    <div class="blockText">
      <div v-if="isLoad" class="Spinner">
        <img src="static/img/spinner.svg">
      </div>
      <div class="firstText">Акция P&amp;G в Зеленом Острове</div>
      <div class="secondText">Отправьте код с чека и участвуйте в розыгрыше путевки!</div>
    </div>
    <div class="inputMain">
      <div class="firstInput">
        <div class="wrapper">
          <label class="textOutsideinput">Код с чека:</label>
          <div  v-if="codeError" class="textOutsideinputSecond">возможно такой код уже зарегистрирован...</div>
        </div>
        <masked-input autofocus inputmode="numeric" type="tel" pattern="[0-9]*" @input="validate" v-model="code" name="browser" mask="11 - 11 - 11" v-bind:class="{ 'picturesInputGreen':codeFilled }" class="picturesInput inputFields" placeholder="00 - 00 - 00" />
      </div>
      <div class="secondInput">
        <div class="wrapper">
          <label class="textOutsideinput">Ваш номер телефона:</label>
          <div  v-if="phoneError" class="textOutsideinputSecond">возможно опечатка в номере телефона...</div>
        </div>
        <masked-input inputmode="numeric" type="tel" pattern="[0-9]*" @input="validate" v-model="phone" name="browser" v-bind:class="{ 'picturesInputGreen':phoneFilled }" class=" picturesInput inputFields" mask="\+\7 (111) 111 - 11 - 11" placeholder="+7 ( 999 ) 000 - 00 - 00" />
      </div>
      <div class="thirdInput">
        <div class="wrapper">
          <label class="textOutsideinput">Ваше имя:</label>
          <div  v-if="nameError"  v-bind:class="{ 'picturesInputGreen':nameFilled }" class="textOutsideinputSecond">возможно опечатка в имени...</div>
        </div>
        <input @input="validate" type="text" v-model="name"
                      name="browser" v-bind:class="{ 'picturesInputGreen':nameFilled }" class=" picturesInput inputFields" placeholder="Имя" />
      </div>
    </div>
    <div class="mainButton">
      <button  v-on:click="sendData" v-bind:class="{ 'greenButton':formReady }" class="Button">отправить</button>
    </div>
  </div>
</template>

<script>
import MaskedInput from 'vue-masked-input'

export default {
  name: 'CheckApp',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      isSuccess: false,
      isError: false,
      phoneFilled: false,
      phoneError: false,
      codeFilled: false,
      codeError: false,
      nameFilled: false,
      nameError: false,
      phone: '',
      code: '',
      name: '',
      info: '',
      isLoad: false,
      formReady: false
    }
  },
  components: {
    MaskedInput
  },
  methods: {
    reload () {
      window.location.reload()
    },
    prepareData () {
      this.name = this.name.replace(/\s\s/g, ' ').replace(/[^А-Яа-яЁёA-Za-z\s]+/g, '').trimLeft()
      const { nameValue, phoneValue, codeValue } = {
        nameValue: this.name.replace(/[^А-Яа-яЁёA-Za-z\s]+/g, '').trim(),
        phoneValue: this.phone.replace(/[^0-9]+/g, '').trim(),
        codeValue: this.code.replace(/[^0-9]+/g, '').trim()
      }
      return { nameValue, phoneValue, codeValue }
    },
    validateData (values) {
      const { nameValue, phoneValue, codeValue } = values
      this.nameFilled = nameValue.length > 3
      this.phoneFilled = phoneValue.length === 11
      this.codeFilled = codeValue.length === 6
      this.formReady = this.nameFilled && this.phoneFilled && this.codeFilled
    },
    validate () {
      if (!this.isLoad) {
        this.validateData(this.prepareData())
      }
    },
    sendData () {
      if (!this.isLoad && this.formReady) {
        const { nameValue, phoneValue, codeValue } = this.prepareData()
        const axios = require('axios').default
        this.isLoad = true
        axios
          .post('http://46.138.244.239:8080/check', {
            name: nameValue,
            phone: phoneValue,
            code: codeValue
          })
          .then((response) => {
            this.isLoad = false
            if (response.data.result) {
              this.isSuccess = true
            } else {
              this.isError = true
            }
          })
      }
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

.secondText {
  font-size: 1.125rem;
  margin: 1rem 0;
}

.Spinner img {
  -webkit-animation: spin 4s linear infinite;
  -moz-animation: spin 4s linear infinite;
  animation: spin 4s linear infinite;
}

.Spinner {
  position: absolute;
  right: 8px;
  top:8px;
}

@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}

@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.inputMain {
  margin-bottom: 3rem;
  font-style: italic;
  font-size: 0.875rem;
  color: #E3E5E5;
  font-weight: 400;
}

.firstInput {
  margin-bottom: 1rem;
}

.textOutsideinput {
  text-align: left;
  flex: 1 0;
}

.picturesInput {
  text-align: center;
  background: url("/static/img/jackdaw.svg") no-repeat calc(100% - 1rem);
  display: block;
}

.picturesInputGreen {

  background: url("/static/img/greenJackdaw.svg") no-repeat calc(100% - 1rem);
  display: block;

}

.picturesInputRed {
  background: url("/static/img/redJackdaw.svg") no-repeat calc(100% - 1rem);
  display: block;
}

.inputFields {
  width: 100%;
  color: white;
  border: 1px solid #00A84F;
  box-sizing: border-box;
  border-radius: 45px;
  font-size: 1.5rem;
  padding: 0.625rem 1rem;
  outline: none;
}

.secondInput {
  margin-bottom: 1rem;
}

.wrapper {
  width: 100%;
  display: flex;
}

.textOutsideinputSecond {
  color: #FFD600;
}

.mainButton {
  margin: 0 auto;
  display: flex;

}

.Button {
  margin: 0 auto;
  display: flex;
  background: #787885;
  font-size: 1.5rem;
  FONT-WEIGHT: 500;
  border-radius: 100px;
  color: white;
  border: none;
  padding: 0.625rem 2rem;
}

.greenButton {
  background: #00A84F;
}
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
.secondTex {
  font-size: 1.125rem;
  margin: 1rem 0;
  line-height: 2rem;
}
.mainWrapper{
  margin-bottom: 2.5156rem;
}
.whatsApp{
  margin-right: 1.5137rem;
}
.secondWrapper{

}
.firstWrapper{
  margin-bottom: 2.5625rem;

}
.number{
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
.instLink{
  display: block;
  width: 4rem;
  margin: 0 auto 6rem auto;
}

</style>
