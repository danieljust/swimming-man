import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import errorProcessor from '../utils/error-processor';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  queryParams: {
    afterDate: {
      refreshModel: true
    },
    userId: {
      refreshModel: true
    }
  },
  adapterError:null,
  model(params) {
    const beforeDate = new Date(params.afterDate);
    beforeDate.setDate(beforeDate.getDate() + 7);
    return this.store.query('report', {
      userId: params.userId,
      afterDate: params.afterDate,
      beforeDate: beforeDate
    })
      .catch((error)=>{
        const Error = errorProcessor(error);
        this.set('adapterError', Error)
    });
  },
  setupController(controller, model)
  {
    this._super(controller, model);
    if (this.get('adapterError') === null) {
      controller.set('isLoaded', true);
      controller.set('responseMessage', (!Ember.isEmpty(model)) ? 'Done' : 'No trainings');
    }
    else{
      controller.set('errorMessage',this.get('adapterError'));
    }
  },
  resetController(controller) {
    controller.set('errorMessage', '');
    controller.set('responseMessage', '');
    controller.set('isLoaded', false);
    this.set('adapterError', null);
    this.get('store').unloadAll('report');
  }
});
