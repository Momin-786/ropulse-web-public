import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSubscriberSession } from '../src/lib/subscriber-session.mjs';
const baseUrl = 'https://api.example.test/api/v1';
test('a forged or expired cookie never establishes a subscriber session', async () => {
  for (const status of [401,403]) {
    const result = await checkSubscriberSession('forged', { baseUrl, fetchImpl: async () => new Response('{}',{status}) });
    assert.deepEqual(result,{authenticated:false,status:200,clearCookie:true});
  }
});
test('session check uses an authoritative authenticated read', async () => {
  const result = await checkSubscriberSession('qa-session',{baseUrl,fetchImpl:async(url,options)=>{
    assert.equal(String(url),`${baseUrl}/subscriber/billing/invoices`);
    assert.equal(options.headers.authorization,'Bearer qa-session');
    assert.equal(options.cache,'no-store');
    return new Response('[]',{status:200});
  }});
  assert.equal(result.authenticated,true);
});
test('an outage does not authenticate or erase the existing session', async () => {
  for(const fetchImpl of [async()=>new Response('',{status:500}), async()=>{throw Error('network');}]) {
    assert.deepEqual(await checkSubscriberSession('qa',{baseUrl,fetchImpl}),{authenticated:false,status:503,clearCookie:false});
  }
});
test('missing cookie and missing service fail closed without network requests', async () => {
  assert.equal((await checkSubscriberSession(undefined,{baseUrl,fetchImpl:()=>{throw Error('must not call');}})).authenticated,false);
  assert.deepEqual(await checkSubscriberSession('qa',{baseUrl:''}),{authenticated:false,status:503,clearCookie:false});
});
