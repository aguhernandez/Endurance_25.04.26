import { WorkoutWithSteps, WorkoutStep } from '../types/workout';

const FIT_FILE_HEADER_SIZE = 14;
const FIT_PROTOCOL_VERSION = 2.0;
const FIT_PROFILE_VERSION = 21.54;

enum FitMessageType {
  FILE_ID = 0,
  WORKOUT = 26,
  WORKOUT_STEP = 27,
}

enum FitFileType {
  WORKOUT = 5,
}

enum FitManufacturer {
  DEVELOPMENT = 255,
}

enum FitWorkoutStepDuration {
  TIME = 0,
  DISTANCE = 1,
  OPEN = 4,
}

enum FitWorkoutStepTarget {
  POWER = 1,
  HEART_RATE = 2,
  OPEN = 0,
}

enum FitWorkoutStepIntensity {
  WARMUP = 1,
  ACTIVE = 0,
  RECOVERY = 2,
  COOLDOWN = 3,
}

function calculateCRC(data: Uint8Array): number {
  const crcTable = new Uint16Array(16);
  let crc = 0;

  for (let i = 0; i < 16; i++) {
    let tmp = i;
    for (let j = 0; j < 4; j++) {
      if (tmp & 1) {
        tmp = (tmp >> 1) ^ 0xCC01;
      } else {
        tmp >>= 1;
      }
    }
    crcTable[i] = tmp;
  }

  for (let i = 0; i < data.length; i++) {
    const byte = data[i];
    let tmp = crcTable[crc & 0xF];
    crc = (crc >> 4) & 0x0FFF;
    crc = crc ^ tmp ^ crcTable[byte & 0xF];
    tmp = crcTable[crc & 0xF];
    crc = (crc >> 4) & 0x0FFF;
    crc = crc ^ tmp ^ crcTable[(byte >> 4) & 0xF];
  }

  return crc;
}

class FitEncoder {
  private buffer: number[] = [];
  private dataSize = 0;

  writeUInt8(value: number): void {
    this.buffer.push(value & 0xFF);
    this.dataSize++;
  }

  writeUInt16(value: number): void {
    this.buffer.push(value & 0xFF);
    this.buffer.push((value >> 8) & 0xFF);
    this.dataSize += 2;
  }

  writeUInt32(value: number): void {
    this.buffer.push(value & 0xFF);
    this.buffer.push((value >> 8) & 0xFF);
    this.buffer.push((value >> 16) & 0xFF);
    this.buffer.push((value >> 24) & 0xFF);
    this.dataSize += 4;
  }

  writeString(value: string, maxLength: number): void {
    const bytes = new TextEncoder().encode(value.slice(0, maxLength - 1));
    for (let i = 0; i < bytes.length; i++) {
      this.buffer.push(bytes[i]);
    }
    for (let i = bytes.length; i < maxLength; i++) {
      this.buffer.push(0);
    }
    this.dataSize += maxLength;
  }

  getBytes(): Uint8Array {
    return new Uint8Array(this.buffer);
  }

  getDataSize(): number {
    return this.dataSize;
  }
}

function writeFileHeader(encoder: FitEncoder, dataSize: number): void {
  encoder.writeUInt8(FIT_FILE_HEADER_SIZE);
  encoder.writeUInt8(Math.floor(FIT_PROTOCOL_VERSION * 16));
  encoder.writeUInt16(Math.floor(FIT_PROFILE_VERSION * 100));
  encoder.writeUInt32(dataSize);
  encoder.writeUInt8('.'.charCodeAt(0));
  encoder.writeUInt8('F'.charCodeAt(0));
  encoder.writeUInt8('I'.charCodeAt(0));
  encoder.writeUInt8('T'.charCodeAt(0));
}

function writeDefinitionMessage(
  encoder: FitEncoder,
  localMessageType: number,
  globalMessageType: number,
  fields: Array<{ fieldDefNum: number; size: number; baseType: number }>
): void {
  encoder.writeUInt8(0x40 | localMessageType);
  encoder.writeUInt8(0);
  encoder.writeUInt8(0);
  encoder.writeUInt16(globalMessageType);
  encoder.writeUInt8(fields.length);

  for (const field of fields) {
    encoder.writeUInt8(field.fieldDefNum);
    encoder.writeUInt8(field.size);
    encoder.writeUInt8(field.baseType);
  }
}

function writeFileIdMessage(encoder: FitEncoder): void {
  writeDefinitionMessage(encoder, 0, FitMessageType.FILE_ID, [
    { fieldDefNum: 0, size: 1, baseType: 0 },
    { fieldDefNum: 1, size: 2, baseType: 132 },
    { fieldDefNum: 2, size: 2, baseType: 132 },
    { fieldDefNum: 4, size: 4, baseType: 134 },
  ]);

  encoder.writeUInt8(0);
  encoder.writeUInt8(FitFileType.WORKOUT);
  encoder.writeUInt16(FitManufacturer.DEVELOPMENT);
  encoder.writeUInt16(0);
  encoder.writeUInt32(Math.floor(Date.now() / 1000) - 631065600);
}

function writeWorkoutMessage(encoder: FitEncoder, workout: WorkoutWithSteps): void {
  writeDefinitionMessage(encoder, 1, FitMessageType.WORKOUT, [
    { fieldDefNum: 4, size: 1, baseType: 0 },
    { fieldDefNum: 8, size: 16, baseType: 7 },
    { fieldDefNum: 5, size: 2, baseType: 132 },
  ]);

  encoder.writeUInt8(1);
  encoder.writeUInt8(0);
  encoder.writeString(workout.name, 16);
  encoder.writeUInt16(workout.steps.length);
}

function getStepIntensity(stepType: string): number {
  switch (stepType) {
    case 'warmup': return FitWorkoutStepIntensity.WARMUP;
    case 'recovery': return FitWorkoutStepIntensity.RECOVERY;
    case 'cooldown': return FitWorkoutStepIntensity.COOLDOWN;
    case 'interval':
    case 'steady':
    default:
      return FitWorkoutStepIntensity.ACTIVE;
  }
}

function writeWorkoutStepMessage(encoder: FitEncoder, step: WorkoutStep, messageIndex: number): void {
  writeDefinitionMessage(encoder, 2, FitMessageType.WORKOUT_STEP, [
    { fieldDefNum: 254, size: 2, baseType: 132 },
    { fieldDefNum: 0, size: 16, baseType: 7 },
    { fieldDefNum: 1, size: 1, baseType: 0 },
    { fieldDefNum: 2, size: 1, baseType: 0 },
    { fieldDefNum: 3, size: 4, baseType: 134 },
    { fieldDefNum: 4, size: 1, baseType: 0 },
    { fieldDefNum: 5, size: 4, baseType: 134 },
    { fieldDefNum: 6, size: 4, baseType: 134 },
    { fieldDefNum: 7, size: 4, baseType: 134 },
  ]);

  encoder.writeUInt8(2);
  encoder.writeUInt16(messageIndex);

  const stepName = `${step.step_type.charAt(0).toUpperCase() + step.step_type.slice(1)} ${step.order + 1}`;
  encoder.writeString(stepName, 16);

  encoder.writeUInt8(getStepIntensity(step.step_type));

  const durationType = step.duration_type === 'time'
    ? FitWorkoutStepDuration.TIME
    : FitWorkoutStepDuration.DISTANCE;
  encoder.writeUInt8(durationType);

  if (step.duration_type === 'time') {
    encoder.writeUInt32(step.duration_value * 1000);
  } else {
    encoder.writeUInt32(step.duration_value * 100);
  }

  let targetType = FitWorkoutStepTarget.OPEN;
  if (step.target_type === 'power') {
    targetType = FitWorkoutStepTarget.POWER;
  } else if (step.target_type === 'hr') {
    targetType = FitWorkoutStepTarget.HEART_RATE;
  }
  encoder.writeUInt8(targetType);

  let targetValue = 0;
  let targetLow = 0;
  let targetHigh = 0;

  if (step.target_type === 'power') {
    if (step.target_percent_ftp) {
      targetValue = step.target_percent_ftp * 10;
      targetLow = step.target_min_value || 0;
      targetHigh = step.target_max_value || 0;
    } else if (step.target_min_value !== undefined && step.target_max_value !== undefined) {
      targetLow = step.target_min_value;
      targetHigh = step.target_max_value;
    }
  }

  encoder.writeUInt32(targetValue);
  encoder.writeUInt32(targetLow);
  encoder.writeUInt32(targetHigh);
}

export function exportWorkoutToFIT(workout: WorkoutWithSteps): Blob {
  const dataEncoder = new FitEncoder();

  writeFileIdMessage(dataEncoder);
  writeWorkoutMessage(dataEncoder, workout);

  workout.steps.forEach((step, index) => {
    writeWorkoutStepMessage(dataEncoder, step, index);
  });

  const dataBytes = dataEncoder.getBytes();
  const crc = calculateCRC(dataBytes);

  const headerEncoder = new FitEncoder();
  writeFileHeader(headerEncoder, dataBytes.length);
  const headerBytes = headerEncoder.getBytes();

  const fullSize = headerBytes.length + dataBytes.length + 2;
  const fullBuffer = new Uint8Array(fullSize);
  fullBuffer.set(headerBytes, 0);
  fullBuffer.set(dataBytes, headerBytes.length);
  fullBuffer[fullSize - 2] = crc & 0xFF;
  fullBuffer[fullSize - 1] = (crc >> 8) & 0xFF;

  return new Blob([fullBuffer], { type: 'application/octet-stream' });
}

export function downloadFIT(workout: WorkoutWithSteps): void {
  const blob = exportWorkoutToFIT(workout);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${workout.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.fit`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
