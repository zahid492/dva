
import React from 'react'
import mgr from '@/containers/userManager'

export default class Callback extends React.Component{
          
           componentDidMount() {
            mgr.signinRedirectCallback()
              .then((user) => this.onRedirectSuccess(user))
              .catch((error) => this.onRedirectError(error));
          }
        
          onRedirectSuccess = (user) => {    
              if(user)
              {
                this.props.history.push('/');
              }            
            
          };
        
          onRedirectError = (error) => {
            mgr.signinRedirect();
          };

           
           render(){
                return (
                   <div></div>                 
               ); 
           }
             
           
}