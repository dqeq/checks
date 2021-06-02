<template>
  <div v-if="isSuccess">
    <SuccessPage />
  </div>
  <div v-else-if="isError">
    <FailPage />
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
        <masked-input ref="codeInput" autofocus inputmode="numeric" type="tel" pattern="[0-9]*" @input="validate" v-model="code" name="browser" mask="11 - 11 - 11" v-bind:class="{ 'picturesInputGreen':codeFilled }" class="picturesInput first inputFields" placeholder="00 - 00 - 00" />
      </div>
      <div class="secondInput">
        <div class="wrapper">
          <label class="textOutsideinput">Ваш номер телефона:</label>
          <div  v-if="phoneError" class="textOutsideinputSecond">возможно опечатка в номере телефона...</div>
        </div>
        <masked-input inputmode="numeric" type="tel" pattern="[0-9]*" @input="validate" v-model="phone" name="browser"
                      v-bind:class="{ 'picturesInputGreen':phoneFilled, 'picturesInputRed':phoneError }" class=" picturesInput inputFields" mask="\+\7 (111) 111 - 11 - 11" placeholder="+7 ( 999 ) 000 - 00 - 00" />
      </div>
      <div class="thirdInput">
        <div class="wrapper">
          <label class="textOutsideinput">Ваше имя:</label>
          <div  v-if="nameError" class="textOutsideinputSecond">возможно опечатка в имени...</div>
        </div>
        <input @input="validate" type="text" v-model="name" v-bind:class="{ 'picturesInputGreen':nameFilled, 'picturesInputRed':nameError }" class=" picturesInput inputFields" placeholder="Имя" />
      </div>
    </div>
    <div class="mainButton">
      <button  v-on:click="sendData" v-bind:class="{ 'greenButton':formReady }" class="Button">отправить</button>
    </div>
  </div>
</template>

<script>
import MaskedInput from 'vue-masked-input'
import FailPage from './FailPage'
import SuccessPage from './SuccessPage'
import axios from 'axios'

export default {
  data () {
    return {
      isSuccess: false,
      isError: false,
      phoneFilled: false,
      phoneChecked: false,
      nameTimerHandler: false,
      inputTimeout: 3000,
      phoneError: false,
      codeFilled: false,
      codeError: false,
      nameFilled: false,
      nameChecked: false,
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
    MaskedInput,
    SuccessPage,
    FailPage
  },
  mounted () {
    document.onreadystatechange = () => {
      const runFocus = (name) => {
        const inputElement = document.querySelector(`input.${name}`)
        console.log(inputElement)
        const newHandler = (e) => {
          inputElement.focus()
        }
        inputElement.onclick = newHandler
        inputElement.click()
        inputElement.focus()
      }
      if (document.readyState === 'complete') {
        let isFirstTime = false
        document.querySelector('body').onclick = () => {
          if (!isFirstTime) {
            isFirstTime = true
            runFocus('first')
          }
        }
      }
    }
  },
  methods: {
    reload () {
      window.location.reload()
    },
    prepareData () {
      this.name = this.name.replace(/\s\s/g, ' ').replace(/[^А-Яа-яЁё\s]+/g, '').trimLeft()
      const {nameValue, phoneValue, codeValue} = {
        nameValue: this.name.replace(/[^А-Яа-яЁё\s]+/g, '').trim(),
        phoneValue: this.phone.replace(/[^0-9]+/g, '').trim(),
        codeValue: this.code.replace(/[^0-9]+/g, '').trim()
      }
      return {nameValue, phoneValue, codeValue}
    },
    validateData (values, fromTimer = false) {
      const {nameValue, phoneValue, codeValue} = values

      // validate phone
      if (!fromTimer && phoneValue.length === 11 && !this.phoneFilled) {
        this.validatePhone()
      }
      // start waiting name end
      if (!fromTimer && nameValue.length > 3) {
        this.isLoad = true
        if (this.nameTimerHandler) {
          clearTimeout(this.nameTimerHandler)
          this.nameChecked = false
        }
        this.nameTimerHandler = setTimeout(this.validateName, this.inputTimeout)
      }
      this.nameFilled = nameValue.length > 3 && !this.nameError && this.nameChecked
      this.phoneFilled = phoneValue.length === 11 && !this.phoneError && this.phoneChecked
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
        const {nameValue, phoneValue, codeValue} = this.prepareData()
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
              if (response.data.message && response.data.message.name) {
                this.isLoad = false
                this.nameError = true
              } else if (response.data.message && response.data.message.phone) {
                this.isLoad = false
                this.phoneError = true
              } else {
                this.isError = true
              }
            }
          })
      }
    },
    validateName () {
      const {nameValue = false} = this.prepareData()
      this.nameChecked = false
      this.isLoad = true
      axios
        .post('http://46.138.244.239:8080/checkname', {
          name: nameValue
        })
        .then((response) => {
          this.isLoad = false
          if (response.data.result) {
            this.nameChecked = true
            this.nameError = false
          } else {
            this.nameChecked = false
            this.nameError = true
          }
          this.validateData(this.prepareData(), true)
        })
    },
    validatePhone () {
      const {phoneValue = false} = this.prepareData()
      this.phoneChecked = false
      this.isLoad = true
      axios
        .post('http://46.138.244.239:8080/checkphone', {
          phone: phoneValue
        })
        .then((response) => {
          this.isLoad = false
          if (response.data.result) {
            this.phoneChecked = true
            this.phoneError = false
          } else {
            this.phoneChecked = false
            this.phoneError = true
          }
          this.validateData(this.prepareData(), true)
        })
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

</style>
