import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Router } from '../src/router.ts';

describe('Router', () => {
  it('parses home route correctly', () => {
    const router = new Router();
    assert.deepEqual(router.parseRoute('/'), { name: 'home' });
    assert.deepEqual(router.parseRoute(''), { name: 'home' });
    assert.deepEqual(router.parseRoute('///'), { name: 'home' });
  });

  it('parses project route correctly', () => {
    const router = new Router();
    assert.deepEqual(router.parseRoute('/projects/proj-123'), {
      name: 'project',
      projectId: 'proj-123',
    });
    assert.deepEqual(router.parseRoute('/projects/my_project/'), {
      name: 'project',
      projectId: 'my_project',
    });
  });

  it('parses chat route correctly', () => {
    const router = new Router();
    assert.deepEqual(
      router.parseRoute('/projects/proj-123/chats/chat-456'),
      {
        name: 'chat',
        projectId: 'proj-123',
        chatId: 'chat-456',
      }
    );
  });

  it('subscribes and notifies on navigate', () => {
    const router = new Router();
    const history: any[] = [];
    const unsubscribe = router.subscribe((route) => {
      history.push(route);
    });

    router.navigate('/projects/p1');
    router.navigate('/projects/p1/chats/c1');

    assert.equal(history.length, 3);
    assert.deepEqual(history[0], { name: 'home' });
    assert.deepEqual(history[1], { name: 'project', projectId: 'p1' });
    assert.deepEqual(history[2], {
      name: 'chat',
      projectId: 'p1',
      chatId: 'c1',
    });

    unsubscribe();
    router.navigate('/');
    assert.equal(history.length, 3);
  });
});
