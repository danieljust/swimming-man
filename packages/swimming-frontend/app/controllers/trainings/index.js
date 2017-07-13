import Ember from 'ember';
import errorProcessor from '../../utils/error-processor';

export default Ember.Controller.extend({
  queryParams: ['userId', 'sort', 'direction'],
  userId: null,
  sort: '',
  direction: '',
  selectedSortColumn: null,
  sortColumns: [
    {
      name: 'Date',
      params: 'date'
    },
    {
      name: 'Distance',
      params: 'distance'
    },
    {
      name: 'Duration',
      params: 'duration'
    }
  ],
  selectedSortOption: null,
  sortOptions: [
    {
      name: 'Ascending',
      params: 'ASC'
    },
    {
      name: 'Descending',
      params: 'DESC'
    }],

  condition: false,

  actions: {
    sort(byColumn) {
      this.set('sort', byColumn.params);
      this.set('selectedSortColumn', byColumn)
    },
    order(byOption) {
      this.set('direction', byOption.params);
      this.set('selectedSortOption', byOption)
    },
    deleteTraining(item) {
      this.store.findRecord('training', item, { backgroundReload: false }).then(
        (training) => {
          training.destroyRecord().catch((error) => {
            const Error = errorProcessor(error);
            this.set('errorMessage', Error);
            training.rollbackAttributes();
        })
      });
    }
  }
});
