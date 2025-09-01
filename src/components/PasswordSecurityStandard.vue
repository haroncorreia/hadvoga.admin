<template>
    <div class="col-5 q-pr-sm">

      <!-- senha -->
      <q-input
        clearable
        filled
        :type="isPwdVisible ? 'password' : 'text'"
        v-model="componentMainObject.usuarios_senha"
        label="Senha"
        placeholder="Insira uma nova senha"
        hint="Senha do usuário"
        maxlength="255"
        style="padding-bottom: 28px"
        @update:model-value="validatePassword(componentMainObject.usuarios_senha)"
        :rules="fieldSenhaRules"
        >
        <template v-slot:append>
          <q-icon :name="isPwdVisible ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdVisible = !isPwdVisible" />
        </template>
      </q-input>

      <!-- confirmaSenha -->
      <q-input
        clearable
        filled
        :type="isPwdVisible ? 'password' : 'text'"
        v-model="componentMainObject.usuarios_confirmaSenha"
        label="Confirmação de senha"
        placeholder="Confirme a nova senha"
        hint="Confirme a senha do usuário"
        maxlength="255"
        style="padding-bottom: 28px"
        @update:model-value="validatePassword(componentMainObject.usuarios_senha)"
        :rules="fieldSenhaRules"
        />

      <q-btn flat rounded color="primary" icon="vpn_key" label="Gerar" @click="generatePassword" />

    </div>
    <div class="col-7 q-pl-sm" style="font-size: 0.8em">
      <div class="q-pb-md q-gutter-sm">
        <strong>Requisitos de segurança para senha</strong>
      </div>
      <div class="q-pb-sm">
        <q-icon class="q-pr-sm" :name="hasMinLength ? 'check' : 'cancel'" :color="hasMinLength ? 'green' : 'red'" size="20px" />
        Deve possuir pelo menos 8 caracteres.
      </div>
      <div class="q-pb-sm">
        <q-icon class="q-pr-sm" :name="hasLowerCase ? 'check' : 'cancel'" :color="hasLowerCase ? 'green' : 'red'" size="20px" />
        Deve possuir pelo menos 1 letra minúscula.</div>
      <div class="q-pb-sm">
        <q-icon class="q-pr-sm" :name="hasUpperCase ? 'check' : 'cancel'" :color="hasUpperCase ? 'green' : 'red'" size="20px" />
        Deve possuir pelo menos 1 letra maiúscula.</div>
      <div class="q-pb-sm">
        <q-icon class="q-pr-sm" :name="hasNumber ? 'check' : 'cancel'" :color="hasNumber ? 'green' : 'red'" size="20px" />
        Deve possuir pelo menos 1 número.</div>
      <div class="q-pb-sm">
        <q-icon class="q-pr-sm" :name="hasSpecialChar ? 'check' : 'cancel'" :color="hasSpecialChar ? 'green' : 'red'" size="20px" />
        Deve possuir pelo menos 1 caractere especial.</div>
      <div class="q-pb-sm">
        <q-icon class="q-pr-sm" :name="isConfirmed ? 'check' : 'cancel'" :color="isConfirmed ? 'green' : 'red'" size="20px" />
        Deve ser confirmado.</div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'

export default defineComponent({
  name: 'PasswordSecurityStandardComponent',
  props: {
    mainObjectProp: {
      type: Object,
      required: true,
    },
  },
  setup (props) {
    const componentMainObject = computed(() => props.mainObjectProp);

    let isValid = ref(false);
    let hasMinLength = ref(false);
    let hasLowerCase = ref(false);
    let hasUpperCase = ref(false);
    let hasNumber = ref(false);
    let hasSpecialChar = ref(false);
    let isConfirmed = ref(false);
    let isPwdVisible = ref(true);

    const fieldSenhaRules = ref([
      (val) => !!val || "* Campo obrigatório.",
    ]);

    onMounted(() => {
      // console.log('PasswordSecurityStandard mounted');
    });

    function validateMinLength(password) {
      return password.length >= 8;
    };
    function validateConfirmed(password) {
      return password === componentMainObject.value.usuarios_confirmaSenha;
    };
    const validateLowerCase = (password) => {
      return /[a-z]/.test(password);
    };
    const validateUpperCase = (password) => {
      return /[A-Z]/.test(password);
    };
    const validateNumber = (password) => {
      return /\d/.test(password);
    };
    const validateSpecialChar = (password) => {
      return /[!@#$%^&*(),.?":{}|<>]/.test(password);
    };

    function validatePassword(password) {
      if (!password) {
        hasMinLength.value = false;
        hasLowerCase.value = false;
        hasUpperCase.value = false;
        hasNumber.value = false;
        hasSpecialChar.value = false;
        return;
      }

      hasMinLength.value = validateMinLength(password);
      hasLowerCase.value = validateLowerCase(password);
      hasUpperCase.value = validateUpperCase(password);
      hasNumber.value = validateNumber(password);
      hasSpecialChar.value = validateSpecialChar(password);
      isConfirmed.value = validateConfirmed(password);
      isValid.value = hasMinLength.value && hasLowerCase.value && hasUpperCase.value && hasNumber.value && hasSpecialChar.value && isConfirmed.value;
    };

    function generatePassword() {
      // Implement password generation logic here
      // For example, you can use a library or custom logic to generate a secure password
      // Gera uma senha de 8 caracteres com letras maiúsculas, minúsculas e números
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      const symbols = '!@#$%&*?';
      let generatedPassword = '';
      for (let i = 0; i < 3; i++) {
        generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        generatedPassword += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
        generatedPassword += numbers.charAt(Math.floor(Math.random() * numbers.length));
        generatedPassword += symbols.charAt(Math.floor(Math.random() * symbols.length));
      }
      componentMainObject.value.usuarios_senha = generatedPassword;
      componentMainObject.value.usuarios_confirmaSenha = generatedPassword; // Automatically set confirmation to match
      validatePassword(generatedPassword);
      isPwdVisible.value = false; // Show the generated password
    };
    return {
      isValid,
      isPwdVisible,
      props,
      hasMinLength,
      hasLowerCase,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
      isConfirmed,
      validatePassword,
      fieldSenhaRules,
      componentMainObject,
      generatePassword,
    };
  }
})
</script>
