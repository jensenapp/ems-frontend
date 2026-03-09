import { useEffect, useState} from 'react';
import { createEmployee, getEmployee, updateEmployee } from './services/EmployeeService';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const EmployeeComponent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');

  const [errors,setErrors] =useState({
    firstName:"",
    lastName:"",
    email:""
  });

  const navigate=useNavigate();

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { ...errors }; // 複製當前 errors 物件

    if (firstName.trim()) {
        errorsCopy.firstName = '';
    } else {
        errorsCopy.firstName = 'First name is required';
        valid = false;
    }

    if (lastName.trim()) {
        errorsCopy.lastName = '';
    } else {
        errorsCopy.lastName = 'Last name is required';
        valid = false;
    }

    if (email.trim()) {
        errorsCopy.email = '';
    } else {
        errorsCopy.email = 'Email is required';
        valid = false;
    }

    setErrors(errorsCopy); // 更新 state
    return valid;          // 回傳驗證結果
}



   const {id}=useParams();

   const pageTitle=()=>{
      if (id) {
        return <h2 className="text-center">Update Employee</h2>
      }else{
        return <h2 className="text-center">Add Employee</h2>
      }
   }



  function saveOrUpdateEmployee(e) {
    e.preventDefault();

    const employee = { firstName, lastName, email };

    console.log(employee);

    if(validateForm()){

      if(id){
       updateEmployee(id,employee).then((response)=>{
         console.log(response.data);
        navigate("/employees");
       }).catch((error)=>{
          console.error(error);
       });
      }else{        
        createEmployee(employee).then((response)=>{
        console.log(response.data);
        navigate("/employees");
    }).catch((error)=>{
          console.error(error);
       });
      }

    }
  }


  useEffect(()=>{
  if(id){
     getEmployee(id).then((response)=>{
 console.log(response.data);
 setFirstName(response.data.firstName);
  setLastName(response.data.lastName);
   setEmail(response.data.email);
   }).catch((error)=>{
    console.error(error);
   });
  }
  },[id]);


  return (
    <div className="container">
      <br /><br />
      <div className="row">
        <div className="card col-md-6 offset-md-3">
          
          {pageTitle()}
          
          <div className="card-body">
            <form onSubmit={saveOrUpdateEmployee}>
              <div className="form-group mb-2">
                <label className="form-label">First Name</label>
                <input type="text" placeholder="Enter Employee First Name"
                  name="firstName" value={firstName} 
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  onChange={(e) => setFirstName(e.target.value)}/>

                  { errors.firstName && <div className='invalid-feedback'> { errors.firstName } </div> }

              </div>
              <div className="form-group mb-2">
                <label className="form-label">Last Name</label>
                <input type="text" placeholder="Enter Employee Last Name"
                  name="lastName" value={lastName} 
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  onChange={(e) => setLastName(e.target.value)}/>

                  { errors.lastName && <div className='invalid-feedback'> { errors.lastName } </div> }


              </div>
              <div className="form-group mb-2">
                <label className="form-label">Email</label>
                <input type="text" placeholder="Enter Employee Email"
                  name="email" value={email} 
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  onChange={(e) => setEmail(e.target.value)} />

{ errors.email && <div className='invalid-feedback'> { errors.email } </div> }

              </div>
              <button className="btn btn-success">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeComponent;