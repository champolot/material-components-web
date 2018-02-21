/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCFloatingLabelFoundation from '../../../packages/mdc-floating-label/foundation';

const {cssClasses} = MDCFloatingLabelFoundation;

suite('MDCFloatingLabelFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCFloatingLabelFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCFloatingLabelFoundation, [
    'addClass', 'removeClass', 'getWidth',
    'registerInteractionHandler', 'deregisterInteractionHandler',
  ]);
});

const setupTest = () => setupFoundationTest(MDCFloatingLabelFoundation);

test('#getWidth returns the width of the label element scaled by 75%', () => {
  const {foundation, mockAdapter} = setupTest();
  const width = 100;
  td.when(mockAdapter.getWidth()).thenReturn(width);
  assert.equal(foundation.getWidth(), width);
});

test('#float called with shouldFloat is true, floats the label', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.float(true);
  td.verify(mockAdapter.addClass(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#float called with shouldFloat is false, de-floats the label', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.float(false);
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#shake called with shouldShake is true, should add shake class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.shake(true);
  td.verify(mockAdapter.addClass(cssClasses.LABEL_SHAKE));
});

test('#shake called with shouldShake is true, should register animationend event listener', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.shake(true);
  td.verify(mockAdapter.registerInteractionHandler('animationend', td.matchers.isA(Function)));
});

test('#shake called with shouldShake is false, should remove shake class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.shake(false);
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_SHAKE));
});

test('#float called with shouldFloat is false, should remove shake class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.float(false);
  td.verify(mockAdapter.removeClass(cssClasses.LABEL_SHAKE));
});

test('#handleShakeAnimationEnd_ should deregisterInteractionHandler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleShakeAnimationEnd_();
  td.verify(mockAdapter.deregisterInteractionHandler('animationend', td.matchers.isA(Function)));
});