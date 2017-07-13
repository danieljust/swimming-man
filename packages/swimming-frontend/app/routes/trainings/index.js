import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import errorProcessor from '../../utils/error-processor';

export default Ember.Route.extend(InfinityRoute, AuthenticatedRouteMixin, {
  errorMessage: null,
  perPageParam: "perPage",
  totalPagesParam: "meta.totalPages",

  queryParams: {
    userId: {
      refreshModel: true
    },
    sort: {
      refreshModel: true
    },
    direction: {
      refreshModel: true
    }
  },
  model(params) {
    return this.infinityModel('training', {
      perPage: 5,
      startingPage: 1,
      userId: params.userId,
      sort: params.sort,
      direction: params.direction
    })
      .catch(error => {
        if (error.errors[0].code === 404 || error.errors[0].code === 403) this.transitionTo('/not-found');
        else {
          const Error = errorProcessor(error);
          this.set('errorMessage', Error)
        }
      })
  },
  setupController(controller, model){
    this._super(controller, model);
    controller.set('errorMessage', this.get('errorMessage'));
  },
  resetController(controller) {
    controller.set('afterDate', null);
    this.set('errorMessage', null);
    controller.set('errorMessage', null);
    controller.set('responseMessage', null);
    controller.set('isSaved', false);
  }
});
