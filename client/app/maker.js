let domoRenderer;
let domoForm;
let DomoFormClass;
let DomoListClass;
let csrf;

const handleDomo = (e) =>{
  e.preventDefault();
  $("#domoMessage").animate({width:'hide'},350);

  if($("#domoName").val() == '' || $("#domoAge").val() == ''){
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $('#domoForm').attr("action"), $("#domoForm").serialize(), function(){
    domoRenderer.loadDomosFromServer();
  });
  return false;
};

const renderDomo = function(){
  csrf = this.props.csrf;
  return(
    <form id="domoForm"
      onSubmit={this.handleSubmit}
      name="domoForm"
      action="/maker"
      method="POST"
      className="domoForm"
      >
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name" />
      <label htmlFor="age">Age: </label>
      <input id="domoAge" type="number" name="age" placeholder="Domo Age" />

      <label id="EduLabel" htmlFor="educationLevel">Education Level: </label>
      <select id="domoEducation" name="educationLevel">
        <option>High School/GED</option>
        <option>Some college</option>
        <option>Bachelors degree</option>
        <option>Masters degree</option>
        <option>Doctorate degree</option>
      </select>
      

      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <input className="makeDomoSubmit" type="submit" value="MakeDomo" />
    </form>
  );



  //  <label htmlFor="educationLevel">Education: </label>
  //  <input id="domoEducation" type="text" name="educationLevel" placeholder="Domo Education" />
};

const renderDomoList = function(){
  if(this.state.data.length === 0){
    return(
      <div className="domoList">
        <h3 className="emptyDomo">No Domos yet</h3>
      </div>
    );
  }
  console.dir(this);
  const domoNodes = this.state.data.map(function(domo){

    console.dir(this);
    return(
      <div key={domo._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName">Name: {domo.name}</h3>
        <h3 className="domoAge">Age: {domo.age}</h3>
        <h3 className="domoEducation">Education Level: {domo.educationLevel}</h3>
        <form className='removeForm' action="/remover" method="POST">
          <input className="makeDomoSubmit" type="submit" value="Release Domo"/>
          <input type="hidden" name="_csrf" value={csrf} />
          <input type="hidden" name="id" value={domo._id}/>
        </form>
      </div>
    );
  });
  return(
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const setup = function(csrf){
  DomoFormClass = React.createClass({
    handleSubmit: handleDomo,
    render: renderDomo,
  });

  DomoListClass = React.createClass({
    loadDomosFromServer: function(){
      sendAjax('GET', '/getDomos', null, function(data){
        this.setState({data:data.domos});
      }.bind(this));
    },
    getInitialState: function(){
      return {data: []};
    },
    componentDidMount: function(){
      this.loadDomosFromServer();
    },
    render: renderDomoList
  });

  domoForm = ReactDOM.render(
    <DomoFormClass csrf={csrf} />, document.querySelector("#makeDomo")
  );

  domoRenderer = ReactDOM.render(
    <DomoListClass />, document.querySelector("#domos")
  )
};

const getToken = () =>{
  sendAjax('GET', '/getToken', null, (result)=>{
    setup(result.csrfToken);
  });
};

$(document).ready(function(){
  getToken();
});








