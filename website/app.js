/* Global Variables */
console.log("Your client app runs successfully ");

let AllData=[];
let Cities=[];
let Countries=[];
// To Handle AutComplete
let oldCountryQuery='';
let oldCityQuery='';
//open weatherapi BaseUrl
// api.openweathermap.org/data/2.5/weather?id={city id}&appid={your api key}

const baseUrl =`https://api.openweathermap.org/data/2.5/weather`;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getDate()+'.'+ (d.getMonth()+1)+'.'+ d.getFullYear();

// Personal API Key for OpenWeatherMap API
const apiKey='1a0e1a35b60ba6236f4320341fd32b64';

// Event listener to add function to existing HTML DOM element
document.querySelector('#generate').addEventListener('click',generate);
// Event listener to autoComplete function to existing HTML DOM element
document.querySelector('#countryListComplete').addEventListener('keyup',searchCountryQuery);
document.querySelector('#cityListComplete').addEventListener('keyup',searchCityQuery);

/* Function called by event listener */
function generate(){
    //Get Filled Data
    let city =GetCity();
    if (city==0) {
        return;
    }
    //Get feelings
    let feelings =document.querySelector('#feelings').value;
    GetAPIData(city.id).then(res=>{
        let finalObj={
            date:newDate,
            city:city.name,
            temperature:res.main.temp,
            details:feelings
        }
        postData('/generate',finalObj).then(res=>{
z        },error=>{
            console.log(" generate postData",error);
        });  
    },error=>{
        console.log('Error',error)
    }).then(GetAllData).then(ApplyTable)
       
}
// Function called by event listener Secrch Country
function searchCountryQuery() {
    let countryQuery =document.querySelector('#countryListComplete').value;
    document.querySelector('#cityListComplete').value='';
    
    if (oldCountryQuery.toLowerCase()==countryQuery.toLowerCase()) {
        return;
    }
    oldCountryQuery=countryQuery
    searchCountry(countryQuery).then(searchCity('',countryQuery));
    
}
// Function called by event listener Secrch city
function searchCityQuery() {
    let cityQuery =document.querySelector('#cityListComplete').value;
    let countryQuery =document.querySelector('#countryListComplete').value;
    if (oldCityQuery.toLowerCase()==cityQuery.toLowerCase()) {
        return;
    }
    oldCityQuery=cityQuery
    searchCity(cityQuery,countryQuery);
}
//Get City 
function GetCity(){
    let cityValueName =document.querySelector('#cityListComplete').value;
    if (cityValueName=='' || cityValueName==undefined ||cityValueName==null) {
        alert("Please Choose Your City")
        return 0;
    }
    let city =Cities.filter(f=>f.name== cityValueName);
    return city[0];
}

/* Function to GET Web API Data*/
// api.openweathermap.org/data/2.5/weather?id={city id}&appid={your api key}

const GetAPIData = async (cityId) =>{ 
    const res = await fetch(`${baseUrl}?id=${cityId}&appid=${apiKey}`);
    try {
    // Transform into JSON
     return  await res.json();
    }
    catch(error) {
      console.log("error", error);
      alert("Sorry there is error in weather Api")
    }
  };
/* Function to POST data */
const postData= async (url,data)=>{
    const request = await fetch(url,{
        method:'POST',
        credentials:'same-origin',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    try {
        const responce = await request.json();
        return responce;

    } catch (error) {
      console.log("postData error", error);
    }
}

/* Function to GET Project Data */
const Get = async (url='') =>{ 
    const res = await fetch(url);
    try {
    // Transform into JSON
     return  await res.json();
    }
    catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
  };
  GetAllData =()=> Get('/all').then(res=>{
                    AllData=res;
                    },error=>{})
    
  // Funcion To Search In City
 searchCity =(cityName , countryName)=> Get(`/searchCity?nameCity=${cityName}&nameCountry=${countryName}`).then(res=>{
                Cities=res;
                },error=>{
                    console.log("Error",error);
                }).then(ApplyCityChanges);

  // Funcion To Search In Country
  searchCountry=(countrName)=> Get(`/searchCountry?nameCountry=${countrName}`).then(res=>{
                    Countries=res;
                    },error=>{
                        console.log("Error",error);
                    }).then(ApplyCountriesChanges);

// ApplyCityChanges
function ApplyCityChanges(){
    AddAutoComplete('cityList',true)

}

// ApplyCountriesChanges
function ApplyCountriesChanges(){
    AddAutoComplete('countryList',false)
}

//Call Needed Function
GetAllData().then(ApplyTable);
searchCity('','');
searchCountry('');
/**  Update UI*/

// Function To Add autoComplete
function AddAutoComplete(id,isCitiy){
    
    let ParentDiv= document.querySelector(`#${id}`);
    ParentDiv.innerHTML='';
    ParentDiv.value='';
    if (isCitiy) {
        Cities.map(m=>{
           let elem= document.createElement('option')
           elem.setAttribute('value',m.name)
            ParentDiv.appendChild(elem);
        })
    }
    else{
        Countries.map(m=>{
                let elem= document.createElement('option')
                elem.setAttribute('value',m)
                 ParentDiv.appendChild(elem);
        })
    }
}

// Update Table UI
function ApplyTable(){
    let tbody= document.querySelector('#dataTable>tbody');
        tbody.innerHTML='';
        AllData.map((m,i)=>{

           let tr= document.createElement('tr');
           tr.addEventListener('click',showDetails);
           tr.setAttribute('id',(i+1))
           //Active FirstElement
           if (i==0) {
                tr.classList.add('active');
                SetCityValues(m,i);
           }
           
           let td1= document.createElement('td');
           td1.innerHTML=`User ${i+1}`;
           tr.appendChild(td1);
           
           let tdcity= document.createElement('td');
           tdcity.innerHTML=m.city;
           tr.appendChild(tdcity);
           
           let td2= document.createElement('td');
           td2.innerHTML=m.date;
           tr.appendChild(td2);
           
           let td3= document.createElement('td');
           td3.innerHTML=m.temperature+'  &#8451;';
           tr.appendChild(td3);
           
           let td4= document.createElement('td');
           if (m.details.length >10) {
                td4.innerHTML=m.details.slice(0, 10)+' ...';
           }else{
                 td4.innerHTML=m.details
           }
           tr.appendChild(td4);
           
           tbody.appendChild(tr);
        });
        
}

// ShowDetails Function
TableRowActive=null;
function showDetails(event){
    // set Active
    if (TableRowActive ==null) {
        let firstRow=document.querySelector('tbody>tr');
        firstRow.className='';
    }
    if (TableRowActive !=null) {
        TableRowActive.target.parentElement.className='';
    }
    event.target.parentElement.className='active';
    TableRowActive=event;
    // get Select  Row
    let id=parseInt(event.target.parentElement.id)
    let selectedCity =AllData[id-1]
    SetCityValues(selectedCity,id-1);
}

function SetCityValues(selectedCity ,index){
    cityTitle=document.querySelector('#cardtitle');
    cityTitle.innerHTML=selectedCity.city;

    cityTemperature=document.querySelector('#temperature');
    cityTemperature.innerHTML=selectedCity.temperature+'  &#8451;';

    cityDate=document.querySelector('.card-subtitle');
    cityDate.innerHTML=selectedCity.date;

    cityContent=document.querySelector('.card-text');
    cityContent.innerHTML=selectedCity.details;

    cityUser=document.querySelector('.card-link');
    cityUser.innerHTML=`User ${index+1}`;
}
