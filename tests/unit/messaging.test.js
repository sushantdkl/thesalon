import test from 'node:test';
import assert from 'node:assert/strict';
import { CREDIT_REMINDER_TEMPLATE, DEFAULT_REMINDER_TEMPLATE, fillMessageTemplate } from '../../src/lib/messaging/template.js';

test('fills name, salon and amount placeholders', () => {
  assert.equal(
    fillMessageTemplate(CREDIT_REMINDER_TEMPLATE, { name: 'Sudip Puri', salon: 'The Salon', amount: 630 }),
    'Namaste Sudip Puri, this is a friendly reminder from The Salon that Rs 630.00 is due on your account. Thank you!',
  );
});

test('formats large amounts the Indian way', () => {
  assert.equal(fillMessageTemplate('Due {amount}', { amount: 125000.5 }), 'Due 1,25,000.50');
});

test('empty placeholders disappear without leaving double spaces', () => {
  assert.equal(fillMessageTemplate('Hi {name} , due {amount}', { name: 'Asha' }), 'Hi Asha, due');
  assert.equal(fillMessageTemplate(DEFAULT_REMINDER_TEMPLATE, { name: '', salon: 'The Salon' }), 'Namaste, this is a friendly reminder from The Salon. We look forward to seeing you.');
});

test('unknown placeholders are left exactly as typed', () => {
  assert.equal(fillMessageTemplate('Hello {name} {restaurant}', { name: 'Ram' }), 'Hello Ram {restaurant}');
});
