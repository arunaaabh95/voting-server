chai = require('chai');
immutable = require('immutable');
core = require('../src/core');

var expect = chai.expect;
var list = immutable.List;
var map = immutable.Map;

describe('application logic', ()=> {

  describe('set entries', () => {

    it('adds the entries to the state', () => {
      const state = map();
      const entries = ['Trainspotting', '28 Days later'];
      const nextState = core.setEntries(state, entries);
      expect(nextState).to.equal(map({
        entries: list.of('Trainspotting', '28 Days later'),
        initialEntries: list.of('Trainspotting', '28 Days Later')
      }));
    });
  });

  describe('next', () => {

    it('takes the next two entries under vote', ()=> {
      const state = map({
        entries: list.of(
          'Trainspotting',
          '28 days later',
          'Sunshine'
        )
      });
      const nextState = core.next(state);
      expect(nextState).to.equal(map({
        vote: map({
          round: 1,
          pair: list.of('Trainspotting', '28 days later')
        }),
        entries: list.of('Sunshine')
      }));
    });

    it("puts winner of current vote back to entries",() => {
      const state = map({
        vote: map({
          round: 1,
          pair: list.of('Trainspotting', '28 days later'),
          tally: map({
            'Trainspotting': 4,
            '28 days later': 2
          })
        }),
        entries: list.of('Sunshine', 'Millions', '127 hours')
      });

      const nextState = core.next(state);
      expect(nextState).to.equal(map({
        entries: list.of('127 hours', 'Trainspotting'),
        vote: map({
          round: 2,
          pair: list.of('Sunshine', 'Millions')
        })
      }));
    });

    it('puts both from tied vote back to entries', () => {
      const state = map({
        vote: map({
          round: 1,
          pair: list.of('Trainspotting', '28 days later'),
          tally: map({
            'Trainspotting': 3,
            '28 days later': 3
          })
        }),
        entries: list.of('Sunshine', 'Millions', '127 hours')
      });
      const nextState = core.next(state);
      expect(nextState).to.equal(map({
        vote: map({
          round: 2,
          pair: list.of('Sunshine', 'Millions')
        }),
        entries: list.of('127 hours', 'Trainspotting', '28 days later')
      }));
    });

    it("marks the winner when just one entry is left", () => {
      const state = map({
        vote: map({
          round: 1,
          pair: list.of('Trainspotting', '28 days later'),
          tally: map({
            'Trainspotting': 4,
            '28 days later': 3
          })
        }),
        entries: list()
      });
      const nextState = core.next(state);
      expect(nextState).to.equal(map({
        winner: 'Trainspotting'
      }));;
    });
  });

  describe('vote', () => {

    it('creates a tally for the voted entry', () => {
      const state = map({
        round: 1,
        pair: list.of('Trainspotting', '28 days later')
      });

      const nextState = core.vote(state, 'Trainspotting', 'voter1');
      expect(nextState).to.equal(map({
        round: 1,
        pair: list.of('Trainspotting', '28 days later'),
        tally: map({ 'Trainspotting': 1}),
        votes: map({
          voter1: 'Trainspotting'
        })
      }));
    });

    it('adds to existing tally for the voted entry', () => {
      const state = map({
        round: 1,
        pair: list.of('Trainspotting', '28 days later'),
        tally: map({
          'Trainspotting': 2,
          '28 days later': 3
        })
      });
      const nextState = core.vote(state, 'Trainspotting', 'voter1');
      expect(nextState).to.equal(map({
        round: 1,
        pair: list.of('Trainspotting', '28 days later'),
        tally: map({
          'Trainspotting': 3,
          '28 days later': 3
        }),
        votes: map({
          voter1: 'Trainspotting'
        })
      }));
    });

    it('ignores the vote if for an invalid entry', () => {
       expect(
         core.vote(map({
           round: 1,
           pair: list.of('Trainspotting', '28 Days Later')
         }), 'Sunshine')
       ).to.equal(
         map({
           round: 1,
           pair: list.of('Trainspotting', '28 Days Later')
         })
       );
  });

 it('nullifies previous vote for the same voter', () => {
      expect(
        core.vote(map({
          round: 1,
          pair: list.of('Trainspotting', '28 Days Later'),
          tally: map({
            'Trainspotting': 3,
            '28 Days Later': 2
        }),
          votes: map({
            voter1: '28 Days Later'
          })
        }), 'Trainspotting', 'voter1')
      ).to.equal(
        map({
          round: 1,
          pair: list.of('Trainspotting', '28 Days Later'),
          tally: map({
            'Trainspotting': 4,
            '28 Days Later': 1
          }),
          votes: map({
            voter1: 'Trainspotting'
           })
         }));
       });
     });
  //end of voting logic
describe('restart', () => {

    it('returns to initial entries and takes the first two entries under vote', () => {
      expect(
        core.restart(map({
          vote: map({
            round: 1,
            pair: list.of('Trainspotting', 'Sunshine')
          }),
          entries: list(),
          initialEntries: list.of('Trainspotting', '28 Days Later', 'Sunshine')
        }))
      ).to.equal(
        map({
          vote: map({
            round: 2,
            pair: list.of('Trainspotting', '28 Days Later')
          }),
          entries: list.of('Sunshine'),
          initialEntries: list.of('Trainspotting', '28 Days Later', 'Sunshine')
        })
      );
    });
  });
});
//end of aplication logic
