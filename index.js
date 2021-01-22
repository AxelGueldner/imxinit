var imxQuery = require('imxquery');

module.exports = (function imxInit() {

  /**
   * call from outside to register new listener
   *
   * @param params
   * @returns {boolean|object*}
   */
  const addListener = (params) => {
    const baseParams = {
      type: 'viewport',
      node: null,
      initCallback: null,
      updateCallback: null
    };

    // update input config with base params for fallback
    const listener = imxQuery.extendObject(params, baseParams);

    // check if the listener type is in the whitelist
    if(typeList.indexOf(listener.type) === -1) {
      return false;
    }else {
      _registerNewListener(listener);
      return listener;
    }
  };

  /**
   * register a new listener
   *
   * @param listener
   * @private
   */
  const _registerNewListener = (listener) => {
    // if this is the first listener of that type …
    if(typeof (library[listener.type]) !== 'object') {
      // … create an empty array for that type
      library[listener.type] = [];
    }

    // preset rendered flag to false to prevent user submiting rendered state in config params
    listener.rendered = false;
    // create the needed eventlistener for the listener
    _createOriginEvents(listener);
    // add the listener to the central library
    library[listener.type].push(listener);
  };

  /**
   * create the origin eventListener for every type
   *
   * @param listener
   * @private
   */
  const _createOriginEvents = (listener) => {
    switch(listener.type) {
      case 'viewport':
        if(!globalTypes.viewport) {
          globalTypes.viewport = true;
          _createOriginEvents_viewport();
        }
        break;
      case 'hover':
        _createOriginEvents_hover(listener);
        break;
      case 'click':
        _createOriginEvents_click(listener);
        break;
    }
  };

  /**
   * this is a complex one - will listen to scroll and resize event on window an calculate if any nodes are in viewport
   *
   * @private
   */
  const _createOriginEvents_viewport = () => {
    const handleEvent = () => {
      const scrollPosition = window.pageYOffset;
      const windowHeight = window.innerHeight;

      for(let listener of library.viewport) {
        const nodeHeight = listener.node.offsetHeight;
        const nodeOffset = imxQuery.offsetTop(listener.node);

        // obviously the current node is inside the viewport
        if(scrollPosition + windowHeight >= nodeOffset && scrollPosition < nodeOffset + nodeHeight) {
          if(!listener.rendered) {
            _dispatchInitEvent(listener);
          }else {
            _dispatchUpdateEvent(listener);
          }
        }
      }
    };

    window.addEventListener('scroll', handleEvent);
    window.addEventListener('resize', handleEvent);

    imxQuery.documentReady(handleEvent);
  };

  /**
   * register hover events on given listener
   *
   * @param listener
   * @private
   */
  const _createOriginEvents_hover = (listener) => {
    const handleEvent = () => {
      if(!listener.rendered) {
        _dispatchInitEvent(listener);
      }else {
        _dispatchUpdateEvent(listener);
      }
    };

    listener.node.addEventListener('mouseover', handleEvent);
  };

  /**
   * register click events on given listener
   *
   * @param listener
   * @private
   */
  const _createOriginEvents_click = (listener) => {
    const handleEvent = () => {
      if(!listener.rendered) {
        _dispatchInitEvent(listener);
      }else {
        _dispatchUpdateEvent(listener);
      }
    };

    listener.node.addEventListener('click', handleEvent);
  };

  /**
   * will dispatch the init event and call callback functions for the given listener
   *
   * @param listener
   * @private
   */
  const _dispatchInitEvent = (listener) => {
    listener.rendered = true;
    console.log('imx_init: firing init', listener.node);

    listener.node.dispatchEvent(initEvent);

    if(typeof (listener.initCallback) == 'function') {
      listener.initCallback();
    }

    listener.node.setAttribute('data-imx_init', 'init');
  };

  const _dispatchUpdateEvent = (listener) => {
    listener.node.dispatchEvent(updateEvent);

    if(typeof (listener.updateCallback) == 'function') {
      listener.updateCallback();
    }
  };

  /**
   * helper function to create an event object
   *
   * @param name
   * @returns {Event}
   * @private
   */
  const _createEvent = (name) => {
    if(typeof window.Event === 'function') {
      return new Event(name);

    }else {
      const customEvent = document.createEvent('Event');
      customEvent.initEvent(name, false, true);
      return customEvent;
    }
  }

  const initEvent = _createEvent('imx_init');
  const updateEvent = _createEvent('imx_update');

  const typeList = ['viewport', 'hover', 'click'];
  const globalTypes = {viewport: false};

  const library = {};

  return {
    addListener: addListener
  };

})();
