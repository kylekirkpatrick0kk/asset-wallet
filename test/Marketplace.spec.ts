import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import Marketplace from '../src/components/Marketplace.vue';

describe('Marketplace.vue', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(Marketplace, {
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
      data() {
        return {
          data: [
            { id: 'bitcoin', name: 'Bitcoin' },
            { id: 'ethereum', name: 'Ethereum' },
          ],
        };
      },
    });
  });

  it('renders the marketplace title', () => {
    expect(wrapper.find('h1').text()).toBe('Marketplace');
  });

  it('renders the wallet section', () => {
    expect(wrapper.find('.wallet-section').exists()).toBe(true);
  });

  it('adds an asset to the wallet', async () => {
    const select = wrapper.find('select');
    const input = wrapper.find('input[type="number"]');
    const button = wrapper.find('#addButton');
    
    await select.setValue('bitcoin');
    await input.setValue(1);
    await button.trigger('click');
    
    const ul = wrapper.find('ul');
    expect(ul.exists()).toBe(true);
  });

  it('removes an asset from the wallet', async () => {
    const select = wrapper.find('select');
    const input = wrapper.find('input[type="number"]');
    const addButton = wrapper.find('#addButton');

    await select.setValue('bitcoin');
    await input.setValue(1);
    await addButton.trigger('click');

    const removeInput = wrapper.findAll('input[type="number"]').at(1);
    const removeButton = wrapper.findAll('#removeButton').at(0);

    if (removeInput && removeButton) {
      await removeInput.setValue(1);
      await removeButton.trigger('click');
    }

    expect(wrapper.find('ul').text()).not.toContain('Bitcoin');
  });
});