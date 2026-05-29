'use strict';

const PipelineStage = Object.freeze({
  NEW:         'NEW',
  QUOTED:      'QUOTED',
  NEGOTIATING: 'NEGOTIATING',
  WON:         'WON',
  LOST:        'LOST',
});

module.exports = PipelineStage;
