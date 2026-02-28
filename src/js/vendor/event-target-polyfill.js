'use strict';

(function() {
  var g =
    typeof globalThis !== 'undefined' ? globalThis :
    typeof window !== 'undefined' ? window :
    typeof self !== 'undefined' ? self :
    this;

  if (typeof g.Event !== 'function') {
    g.Event = function Event(type) {
      this.type = String(type || '');
      this.target = null;
      this.defaultPrevented = false;
    };
    g.Event.prototype.preventDefault = function() {
      this.defaultPrevented = true;
    };
  }

  if (typeof g.CustomEvent !== 'function') {
    g.CustomEvent = function CustomEvent(type, options) {
      var event = new g.Event(type);
      event.detail = options && typeof options.detail !== 'undefined' ? options.detail : null;
      return event;
    };
  }

  if (typeof g.EventTarget !== 'function') {
    function EventTarget() {
      this._listeners = {};
    }

    EventTarget.prototype.addEventListener = function(type, listener) {
      if (!type || typeof listener !== 'function') {
        return;
      }
      var listeners = this._listeners[type] || (this._listeners[type] = []);
      if (listeners.indexOf(listener) === -1) {
        listeners.push(listener);
      }
    };

    EventTarget.prototype.removeEventListener = function(type, listener) {
      var listeners = this._listeners[type];
      if (!listeners) {
        return;
      }
      var index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };

    EventTarget.prototype.dispatchEvent = function(event) {
      if (!event || !event.type) {
        return true;
      }
      event.target = this;
      var listeners = this._listeners[event.type];
      if (!listeners || !listeners.length) {
        return true;
      }
      listeners.slice().forEach(function(listener) {
        try {
          listener.call(this, event);
        } catch (e) {
          console.log('[Polyfill] Event listener error: ' + e);
        }
      }, this);
      return !event.defaultPrevented;
    };

    g.EventTarget = EventTarget;
  }
})();

