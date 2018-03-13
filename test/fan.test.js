const { expect } = require('chai');

const { log, setup } = require('./helpers/setup')
const ping = require('./helpers/fakePing')
const FakeServiceManager = require('./helpers/fakeServiceManager')

const delayForDuration = require('../helpers/delayForDuration')
const { getDevice } = require('../helpers/getDevice')

const { Fan } = require('../accessories')

// TODO: Check the closest hex is chosen for fan speed

const data = {
  on: 'ON',
  off: 'OFF',
  clockwise: 'CLOCKWISE',
  counterClockwise: 'COUNTERCLOCKWISE',
  swingToggle: 'SWINGTOGGLE',
  fanSpeed5: 'FANSPEED5',
  fanSpeed10: 'FANSPEED10',
  fanSpeed20: 'FANSPEED20',
  fanSpeed30: 'FANSPEED30',
  fanSpeed40: 'FANSPEED40',
}

describe('fanAccessory', () => {

  // Fan Turn On
  it('turns on', async () => {
    const { device } = setup();

    const config = {
      data,
      host: device.host.address,
      persistState: false
    }
    
    const fanAccessory = new Fan(null, config, 'FakeServiceManager')
    fanAccessory.serviceManager.setCharacteristic(Characteristic.On, true)
    
    expect(fanAccessory.state.switchState).to.equal(true);

    // Check hex code was sent
    const hasSentCode = device.hasSentCode('ON');
    expect(hasSentCode).to.equal(true);

    // Check that only one code has been sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(1);
  });


  // Fan Turn On then Off
  it('turns off', async () => {
    const { device } = setup();

    const config = {
      data,
      host: device.host.address,
      persistState: false
    }
    
    const fanAccessory = new Fan(null, config, 'FakeServiceManager')

    // Turn On Fan
    fanAccessory.serviceManager.setCharacteristic(Characteristic.On, true)
    expect(fanAccessory.state.switchState).to.equal(true);
    
    // Turn Off Fan
    fanAccessory.serviceManager.setCharacteristic(Characteristic.On, false)
    expect(fanAccessory.state.switchState).to.equal(false);

    // Check hex code was sent
    const hasSentCode = device.hasSentCode('OFF');
    expect(hasSentCode).to.equal(true);

    // Check that only one code has been sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(2);
  });


  // Fan Speed
  it('fan speed set to 20', async () => {
    const { device } = setup();

    const config = {
      host: device.host.address,
      persistState: false,
      data
    }
    
    const fanAccessory = new Fan(null, config, 'FakeServiceManager')
    fanAccessory.serviceManager.setCharacteristic(Characteristic.RotationSpeed, 20)
    
    expect(fanAccessory.state.fanSpeed).to.equal(20);

    // Check hex code was sent
    const hasSentCode = device.hasSentCode('FANSPEED20');
    expect(hasSentCode).to.equal(true);

    // Check that only one code has been sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(1);
  });


  // Fan Speed Closed
  it('fan speed set to 32 (closest 30)', async () => {
    const { device } = setup();

    const config = {
      data,
      host: device.host.address,
      persistState: false
    }
    
    
    
    const fanAccessory = new Fan(null, config, 'FakeServiceManager')
    fanAccessory.serviceManager.setCharacteristic(Characteristic.RotationSpeed, 32)
    
    expect(fanAccessory.state.fanSpeed).to.equal(32);

    // Check hex code was sent
    const hasSentCode = device.hasSentCode('FANSPEED30');
    expect(hasSentCode).to.equal(true);

    // Check that only one code has been sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(1);
  });


  // Fan Speed Closed
  it('fan speed set to 36 (closest 40)', async () => {
    const { device } = setup();

    const config = {
      data,
      host: device.host.address,
      persistState: false
    }
    
    
    
    const fanAccessory = new Fan(null, config, 'FakeServiceManager')
    fanAccessory.serviceManager.setCharacteristic(Characteristic.RotationSpeed, 36)
    
    expect(fanAccessory.state.fanSpeed).to.equal(36);

    // Check hex code was sent
    const hasSentCode = device.hasSentCode('FANSPEED40');
    expect(hasSentCode).to.equal(true);

    // Check that only one code has been sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(1);
  });


  // Fan Turn Swing Mode On
  it('swing mode on', async () => {
    const { device } = setup();

    const config = {
      data,
      host: device.host.address,
      persistState: false
    }
    
    
    
    const fanAccessory = new Fan(null, config, 'FakeServiceManager')
    fanAccessory.serviceManager.setCharacteristic(Characteristic.SwingMode, 1)
    
    expect(fanAccessory.state.swingMode).to.equal(1);

    // Check hex code was sent
    const hasSentCode = device.hasSentCode('SWINGTOGGLE');
    expect(hasSentCode).to.equal(true);

    // Check that only one code has been sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(1);
  });


  // Fan Turn Swing Mode On then Off
  it('swing mode off', async () => {
    const { device } = setup();

    const config = {
      data,
      host: device.host.address,
      persistState: false
    }
    
    
    
    const fanAccessory = new Fan(null, config, 'FakeServiceManager')

    // Turn On Swing Mode
    fanAccessory.serviceManager.setCharacteristic(Characteristic.SwingMode, 1)
    expect(fanAccessory.state.swingMode).to.equal(1);
    
    // Turn Off Swing Mode
    fanAccessory.serviceManager.setCharacteristic(Characteristic.SwingMode, 0)
    expect(fanAccessory.state.swingMode).to.equal(0);

    // Check hex code was sent
    const hasSentCode = device.hasSentCode('SWINGTOGGLE');
    expect(hasSentCode).to.equal(true);

    // Check that only one code has been sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(2);
  });


  // Hide Swing Mode
  it('"hideSwingMode": true', async () => {
    const { device } = setup();

    const config = {
      data,
      host: device.host.address,
      persistState: false,
      hideSwingMode: true,
    }
    
    ;
    
    const fanAccessory = new Fan(null, config, 'FakeServiceManager');

    // Attempt To Turn On Swing Mode
    fanAccessory.serviceManager.setCharacteristic(Characteristic.SwingMode, 1)
    expect(fanAccessory.state.swingMode).to.equal(undefined);

    // Check that no code has been sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(0);
  });


  // Fan Turn Swing Mode On
  it('rotation direction clockwise', async () => {
    const { device } = setup();;

    const config = {
      data,
      host: device.host.address,
      persistState: false
    };
    
    ;
    
    const fanAccessory = new Fan(null, config, 'FakeServiceManager');
    fanAccessory.serviceManager.setCharacteristic(Characteristic.RotationDirection, 0);
    
    expect(fanAccessory.state.rotationDirection).to.equal(0);

    // Check hex code was sent
    const hasSentCode = device.hasSentCode('CLOCKWISE');
    expect(hasSentCode).to.equal(true);

    // Check that only one code has been sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(1);
  });


  // Set Rotation Direction To Clockwise Then Anti-clockwise
  it('rotation direction anti-clockwise', async () => {
    const { device } = setup();

    const config = {
      data,
      host: device.host.address,
      persistState: false
    }
    
    const fanAccessory = new Fan(null, config, 'FakeServiceManager')

    // Turn On Swing Mode
    fanAccessory.serviceManager.setCharacteristic(Characteristic.RotationDirection, 0)
    expect(fanAccessory.state.rotationDirection).to.equal(0);

    // Check hex code was sent
    let hasSentCode = device.hasSentCode('CLOCKWISE');
    expect(hasSentCode).to.equal(true);
    
    // Turn Off Swing Mode
    fanAccessory.serviceManager.setCharacteristic(Characteristic.RotationDirection, 1)
    expect(fanAccessory.state.rotationDirection).to.equal(1);

    // Check hex code was sent
    hasSentCode = device.hasSentCode('COUNTERCLOCKWISE');
    expect(hasSentCode).to.equal(true);

    // Check that only one code has been sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(2);
  });


  // Hide Rotation Direction
  it('"hideRotationDirection": true', async () => {
    const { device } = setup();

    const config = {
      data,
      host: device.host.address,
      persistState: false,
      hideRotationDirection: true,
    }
    
    ;
    
    const fanAccessory = new Fan(null, config, 'FakeServiceManager')

    // Attempt To Set Rotation Direction To Clockwise
    fanAccessory.serviceManager.setCharacteristic(Characteristic.RotationDirection, 1)
    expect(fanAccessory.state.rotationDirection).to.equal(undefined);

    // Check that no code has been sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(0);
  });


  // Persist State 
  it('"persistState": true', async () => {
    const { device } = setup();

    const config = {
      name: 'Unit Test Fan',
      data,
      host: device.host.address,
      persistState: true
    }
    
    let fanAccessory

    // Turn On Fan
    fanAccessory = new Fan(null, config, 'FakeServiceManager')
    fanAccessory.serviceManager.setCharacteristic(Characteristic.On, true)
    expect(fanAccessory.state.switchState).to.equal(true);

    // Should still be on when loading within a new instance
    fanAccessory = new Fan(null, config, 'FakeServiceManager')
    expect(fanAccessory.state.switchState).to.equal(true);
    
    // Turn Off Fan
    fanAccessory.serviceManager.setCharacteristic(Characteristic.On, false)
    expect(fanAccessory.state.switchState).to.equal(false);

    // Should still be off when loading within a new instance
    fanAccessory = new Fan(null, config, 'FakeServiceManager')
    expect(fanAccessory.state.switchState).to.equal(false);
  });

  it('"persistState": false', async () => {
    const { device } = setup();

    const config = {
      data,
      host: device.host.address,
      name: 'Unit Test Fan',
      persistState: false
    }
    
    let fanAccessory

    // Turn On Fan
    fanAccessory = new Fan(null, config, 'FakeServiceManager')
    fanAccessory.serviceManager.setCharacteristic(Characteristic.On, true)
    expect(fanAccessory.state.switchState).to.equal(true);

    // Should be off again with a new instance
    fanAccessory = new Fan(null, config, 'FakeServiceManager')
    expect(fanAccessory.state.switchState).to.equal(undefined);
  });


  // Ensure the hex is resent after reload
  it('"resendHexAfterReload": true, "persistState": true', async () => {
    const { device } = setup();

    const config = {
      data,
      host: device.host.address,
      persistState: true,
      resendHexAfterReload: true,
      resendDataAfterReloadDelay: 0.1,
      isUnitTest: true
    }
    
    
    
    let fanAccessory

    // Turn On Fan
    fanAccessory = new Fan(null, config, 'FakeServiceManager')
    fanAccessory.serviceManager.setCharacteristic(Characteristic.On, true)
    expect(fanAccessory.state.switchState).to.equal(true);

    // Wait for resendDataAfterReloadDelay
    await delayForDuration(0.3)

    device.resetSentHexCodes()

    // Should be on still with a new instance
    fanAccessory = new Fan(null, config, 'FakeServiceManager')
    expect(fanAccessory.state.switchState).to.equal(true);

    // We should find that setCharacteristic has been called after a duration of resendDataAfterReloadDelay
    await delayForDuration(0.3)
    expect(fanAccessory.serviceManager.hasRecordedSetCharacteristic).to.equal(true);

    // Check ON hex code was sent
    const hasSentOnCode = device.hasSentCode('ON');
    expect(hasSentOnCode).to.equal(true);

    // Check that only one code has been sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(1);
  });


  // Ensure the hex is not resent after reload
  it('"resendHexAfterReload": false, "persistState": true', async () => {
    const { device } = setup();

    const config = {
      data,
      host: device.host.address,
      persistState: true,
      resendHexAfterReload: false,
      resendDataAfterReloadDelay: 0.1,
      isUnitTest: true
    }

    
    
    let fanAccessory

    // Turn On Fan
    fanAccessory = new Fan(null, config, 'FakeServiceManager')
    fanAccessory.serviceManager.setCharacteristic(Characteristic.On, true)
    expect(fanAccessory.state.switchState).to.equal(true);

    // Wait for resendDataAfterReloadDelay
    await delayForDuration(0.3)

    device.resetSentHexCodes()

    // Should be on still with a new instance
    fanAccessory = new Fan(null, config, 'FakeServiceManager')
    expect(fanAccessory.state.switchState).to.equal(true);

    // We should find that setCharacteristic has not been called after a duration of resendHexAfterReloadDelay
    await delayForDuration(0.3)
    expect(fanAccessory.serviceManager.hasRecordedSetCharacteristic).to.equal(false);

    // Check ON hex code was not sent
    const hasSentOnCode = device.hasSentCode('ON');
    expect(hasSentOnCode).to.equal(false);

    // Check that no code was sent
    const sentHexCodeCount = device.getSentHexCodeCount();
    expect(sentHexCodeCount).to.equal(0);
  });
})
