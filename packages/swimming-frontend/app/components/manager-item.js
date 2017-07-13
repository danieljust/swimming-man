import Ember from 'ember';
import errorProcessor from '../utils/error-processor';

export default Ember.Component.extend({
  responseMessage: null,
  status: function(){
    return this.get('user.managers').includes(this.get('manager.id')) ? 'Unassign' : 'Assign';
  }.property('user.managers', 'manager.id'),
  willDestroyElement(){
    this.set('responseMessage', null);
  },
  actions:{
    changeManagerStatus(manager, user, emberAjax){
      if(this.get('status') === 'Assign')
      {
        return emberAjax.request('api/appointment', {
          method: 'POST',
          data: {
            userId: user.id,
            managerId: manager.id,
            position: 'manager'
          }
        })
          .then(() => {
            this.set('isSaved', true);
            this.set('status', 'Unassign');
            this.set('responseMessage', 'User has been successfully assigned');
          })
          .catch(error => {
            const Error = errorProcessor(error);
            this.set('errorMessage', Error)
          });
      }
      else{
        return emberAjax.request('api/appointment', {
          method: 'DELETE',
          data: {
            userId: user.id,
            managerId: manager.id,
            position: 'manager'
          }
        })
          .then(() => {
            this.set('isSaved', true);
            this.set('status', 'Assign');
            this.set('responseMessage', 'User has been successfully unassigned');
          })
          .catch(error => {
            const Error = errorProcessor(error);
            this.set('errorMessage', Error)
          });
      }
    }
  }
});
