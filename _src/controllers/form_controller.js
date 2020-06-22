import { Controller } from 'stimulus';

export default class extends Controller {
  static targets = ['form', 'input', 'alert'];

  initialize() {
    this.timer = 0
  }

  validateOnInput(event) {
    let field = event.currentTarget
    let self = this

    field.setAttribute('changed', true)
    if (field.hasAttribute('failed')) {
      clearTimeout (this.timer);
      this.timer = setTimeout(function() {
        self.validate(field)
      }, 500)
    }
  }

  validateOnBlur(event) {
    let field = event.currentTarget

    if (field.hasAttribute('changed')) {
      this.validate(field)
    }
  }

  submitForm(event) {
    event.preventDefault();
    this.validateForm();

    if (this.isValid) {
      this.ajax()
    }
  }

  ajax() {
    let self = this
    var data = new FormData(this.formTarget);
    var xhr = new XMLHttpRequest();

    xhr.open(this.formTarget.method, this.formTarget.action);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;

      if (xhr.status === 200) {
        let alert_template = require('../handlebars/success_alert.handlebars')
        let context = { heading: "Your message was successfully sent", text: "I'll get back to you soon." }
        self.formTarget.insertAdjacentHTML('beforebegin', alert_template(context))
        self.disconnect()
        self.formTarget.remove()
      } else {
        if (self.hasAlertTarget) {
          self.alertTarget.remove()
        }
        let alert_template = require('../handlebars/error_alert.handlebars')
        let context = { heading: "Your message could not be sent", text: xhr.response }
        self.formTarget.insertAdjacentHTML('afterbegin', alert_template(context))
      }
    };

    xhr.send(data);
  }

  success(response, responseType) {
    
  }

  error(status, response, responseType) {
    
  }

  validateForm() {
    this.isValid = true;
    let self = this;

    this.inputTargets.forEach((field) => {
      self.validate(field)
    })
  }

  validate(field) {
    let fieldName = field.getAttribute('name').replace(/_/g, ' ')
    fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)

    if (!field.disabled && !field.validity.valid) {
      this.isValid = false;
      field.setAttribute('failed', true)

	    if (field.validity.valueMissing) {
        this.showError(field, fieldName + " can't be blank");
	    } else if (field.type == 'email' && field.validity.typeMismatch) {
        this.showError(field, "Please enter a valid email");
	    } else if (field.validity.tooShort) {
        let minLength = field.getAttribute('minlength');
	      this.showError(field, fieldName + " is too short (minimum " + minLength + " characters)");
	    } else if (field.validity.tooLong) {
        let maxLength = field.getAttribute('maxlength');
        this.showError(field, fieldName + " is too long (maximum " + maxLength + " characters)");
      } else {
        this.showError(field, fieldName + " is invalid");
	    }
    } else if (field.classList.contains('error')) {
      this.removeError(field);
    }
  }

  showError(field, msg) {
    let inputContainer = field.closest('div');
    field.classList.add('error')
    field.classList.add('placeholder-red-300')

    let sibling = inputContainer.nextElementSibling
    if (sibling) {
      if (sibling.classList.contains('text-red-600')) {
        sibling.remove()
      } else {
        sibling.classList.add('hidden')
      }
    }
    inputContainer.insertAdjacentHTML('afterend', "<p class='mt-2 text-sm text-red-600'>" + msg + "</p>")
  }

  removeError(field) {
    let inputContainer = field.closest('div');
    field.classList.remove('error');
    field.classList.remove('placeholder-red-300');

    let sibling = inputContainer.nextElementSibling
    sibling.remove()
    sibling = inputContainer.nextElementSibling

    if (sibling) {
      sibling.classList.remove('hidden')
    }
  }
}
