import { Controller } from 'stimulus'

export default class extends Controller {
  static targets = ['menu', 'button']

  connect() {
    //this.toggleClass = this.data.get('class') || 'hidden'
    this.fromClasses = this.data.get('from').split(' ') || ['hidden']
    this.toClasses = this.data.get('to').split(' ')
    this.enteringClasses = this.data.get('entering').split(' ')
    this.leavingClasses = this.data.get('leaving').split(' ')
    let self = this;

    // add from classes
    this.fromClasses.forEach(function(klass) {
      self.menuTarget.classList.add(klass)
    })

    // add entering transitions
    this.enteringClasses.forEach(function(klass) {
      self.menuTarget.classList.add(klass)
    })

    this.hidden = true

    // Add correct margin right
    if (this.data.get('custom')) {
      this.menuTarget.style.marginRight = this.buttonTarget.offsetWidth / 2 + "px"
    }
  }

  toggle() {
    let self = this;
    
    if (this.hidden) {
      // remove from classes
      this.fromClasses.forEach(function(klass) {
        self.menuTarget.classList.remove(klass)
      })

      // show to classes
      this.toClasses.forEach(function(klass) {
        self.menuTarget.classList.add(klass)
      })

      // remove entering classes
      this.enteringClasses.forEach(function(klass) {
        self.menuTarget.classList.remove(klass)
      })

      // add leaving transitions
      this.leavingClasses.forEach(function(klass) {
        self.menuTarget.classList.add(klass)
      })

      this.hidden = false
    } else {
      this.toggleHide();
    }
  }

  hide(event) {
    if (this.element.contains(event.target) === false && !this.hidden) {
      this.toggleHide()
    }
  }

  toggleHide() {
    let self = this;

    // remove to classes
    this.toClasses.forEach(function(klass) {
      self.menuTarget.classList.remove(klass)
    })

    // show from classes
    this.fromClasses.forEach(function(klass) {
      self.menuTarget.classList.add(klass)
    })

    // remove leaving classes
    this.leavingClasses.forEach(function(klass) {
      self.menuTarget.classList.remove(klass)
    })

    // add entering transitions
    this.enteringClasses.forEach(function(klass) {
      self.menuTarget.classList.add(klass)
    })

    this.hidden = true
  }
}
