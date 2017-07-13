import Ember from 'ember';
import InfinityRoute from 'ember-infinity/mixins/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(InfinityRoute, AuthenticatedRouteMixin, {

  perPageParam: "perPage",
  totalPagesParam: "meta.totalPages",
  condition: false,
  model() {
    return this.infinityModel('user', { perPage: 5, startingPage: 1 });
  }
});
