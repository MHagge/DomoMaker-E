"use strict";

var domoRenderer = void 0;
var domoForm = void 0;
var DomoFormClass = void 0;
var DomoListClass = void 0;
var csrf = void 0;

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $('#domoForm').attr("action"), $("#domoForm").serialize(), function () {
    domoRenderer.loadDomosFromServer();
  });
  return false;
};

var renderDomo = function renderDomo() {
  csrf = this.props.csrf;
  return React.createElement(
    "form",
    { id: "domoForm",
      onSubmit: this.handleSubmit,
      name: "domoForm",
      action: "/maker",
      method: "POST",
      className: "domoForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
    React.createElement(
      "label",
      { htmlFor: "age" },
      "Age: "
    ),
    React.createElement("input", { id: "domoAge", type: "number", name: "age", placeholder: "Domo Age" }),
    React.createElement(
      "label",
      { id: "EduLabel", htmlFor: "educationLevel" },
      "Education Level: "
    ),
    React.createElement(
      "select",
      { id: "domoEducation", name: "educationLevel" },
      React.createElement(
        "option",
        null,
        "High School/GED"
      ),
      React.createElement(
        "option",
        null,
        "Some college"
      ),
      React.createElement(
        "option",
        null,
        "Bachelors degree"
      ),
      React.createElement(
        "option",
        null,
        "Masters degree"
      ),
      React.createElement(
        "option",
        null,
        "Doctorate degree"
      )
    ),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "MakeDomo" })
  );

  //  <label htmlFor="educationLevel">Education: </label>
  //  <input id="domoEducation" type="text" name="educationLevel" placeholder="Domo Education" />
};

var renderDomoList = function renderDomoList() {
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "domoList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        "No Domos yet"
      )
    );
  }
  console.dir(this);
  var domoNodes = this.state.data.map(function (domo) {

    console.dir(this);
    return React.createElement(
      "div",
      { key: domo._id, className: "domo" },
      React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
      React.createElement(
        "h3",
        { className: "domoName" },
        "Name: ",
        domo.name
      ),
      React.createElement(
        "h3",
        { className: "domoAge" },
        "Age: ",
        domo.age
      ),
      React.createElement(
        "h3",
        { className: "domoEducation" },
        "Education Level: ",
        domo.educationLevel
      ),
      React.createElement(
        "form",
        { className: "removeForm", action: "/remover", method: "POST" },
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Release Domo" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
        React.createElement("input", { type: "hidden", name: "id", value: domo._id })
      )
    );
  });
  return React.createElement(
    "div",
    { className: "domoList" },
    domoNodes
  );
};

var setup = function setup(csrf) {
  DomoFormClass = React.createClass({
    displayName: "DomoFormClass",

    handleSubmit: handleDomo,
    render: renderDomo
  });

  DomoListClass = React.createClass({
    displayName: "DomoListClass",

    loadDomosFromServer: function loadDomosFromServer() {
      sendAjax('GET', '/getDomos', null, function (data) {
        this.setState({ data: data.domos });
      }.bind(this));
    },
    getInitialState: function getInitialState() {
      return { data: [] };
    },
    componentDidMount: function componentDidMount() {
      this.loadDomosFromServer();
    },
    render: renderDomoList
  });

  domoForm = ReactDOM.render(React.createElement(DomoFormClass, { csrf: csrf }), document.querySelector("#makeDomo"));

  domoRenderer = ReactDOM.render(React.createElement(DomoListClass, null), document.querySelector("#domos"));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {

  //console.dir(data);

  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
