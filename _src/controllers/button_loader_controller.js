import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "button" ]

  initialize() {
    this.remove();
  }

  load() {
    if (!!!this.buttonTarget.querySelector(".spinner")) {
      var loader = document.createElement("SPAN");
      loader.classList.add("spinner");
      loader.classList.add("ml-4");
      this.buttonTarget.appendChild(loader);
      var self = this;
      setTimeout(function(){
        self.buttonTarget.disabled = true;
      }, 50);
    }
  }

  remove() {
    if (this.buttonTarget.querySelector(".spinner")) {
      this.buttonTarget.disabled = false;
      this.buttonTarget.querySelector(".spinner").remove();
    }
  }
}
