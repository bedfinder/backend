import dotenv from 'dotenv';
import * as http from 'http';
import axios, { AxiosResponse } from 'axios';
import { Connection } from '../../src/db/Connection';
import { Server } from '../../src/server';
import { BedRepository } from '../../src/db/repository/BedRepository';
import { HospitalRepository } from '../../src/db/repository/HospitalRepository';
import { createBed, createHospital } from '../helper';
import { BaseResponse } from '../../src/interfaces/http/BaseResponse';
import { Bed } from '../../src/interfaces/models/Bed';
import { BedService } from '../../src/services/BedService';
import { BedValidation } from '../../src/validation/business/BedValidation';

dotenv.config();

let httpServer: http.Server;

axios.defaults.baseURL = 'http://localhost:3000/v1/beds';

const created: string[] = [];

describe('beds', () => {
  let hospital: string;

  beforeAll(async done => {
    await Connection.create();
    const s: Server = new Server();

    await s.init();

    s.app.set('port', '3000');
    httpServer = http.createServer(s.app);
    httpServer.listen(3000);

    const r: HospitalRepository = new HospitalRepository();
    // @ts-ignore
    hospital = (await r.create(createHospital()))._id.toString();

    done();
  });

  afterAll(async done => {
    const repo: BedRepository = new BedRepository();
    for (const id of created) {
      await repo.delete(id);
    }

    await Connection.destroy();
    await httpServer.close();
    done();
  });

  it('should create a bed', async done => {
    expect.assertions(5);
    const res: AxiosResponse<BaseResponse<Bed>> = await axios.post(
      '/',
      createBed(hospital)
    );
    const item: Bed = res.data.data as Bed;

    expect(res.status).toBe(200);
    expect(item._id).toBeDefined();
    expect(item.createdAt).toBeDefined();
    expect(item.updatedAt).toBeDefined();
    expect(item.hospital).toBe(hospital);

    created.push(item._id!);
    done();
  });

  it('should fail to create a bed with a validation error', async done => {
    expect.assertions(2);
    const spy: jest.SpyInstance = jest.spyOn(BedService.prototype, 'create');
    await expect(axios.post('/', createBed(''))).rejects.toThrow(
      'Request failed with status code 422'
    );

    expect(BedService.prototype.create).not.toBeCalled();
    spy.mockReset();
    done();
  });

  it('should fail to create a bed, because a standard bed cannot have an ecmo', async done => {
    expect.assertions(3);
    const serviceSpy: jest.SpyInstance = jest.spyOn(
      BedService.prototype,
      'create'
    );
    const validationSpy: jest.SpyInstance = jest.spyOn(
      BedValidation.prototype,
      'validate'
    );
    await expect(
      axios.post('/', createBed(hospital, { isHighCare: false, hasEcmo: true }))
    ).rejects.toThrow('Request failed with status code 400');
    expect(BedValidation.prototype.validate).toBeCalled();
    expect(BedService.prototype.create).toBeCalled();
    serviceSpy.mockReset();
    validationSpy.mockReset();
    done();
  });

  describe('existing bed actions', () => {
    let bed: string;

    beforeAll(async done => {
      bed = (await axios.post('/', createBed(hospital))).data.data._id!;
      created.push(bed);
      done();
    });

    it('should update an existing bed', async done => {
      expect.assertions(4);
      const spy: jest.SpyInstance = jest.spyOn(BedService.prototype, 'update');
      const res: AxiosResponse<BaseResponse<Bed>> = await axios.patch(
        `/${bed}`,
        { isAvailable: true }
      );

      expect(res.status).toBe(200);
      expect(BedService.prototype.update).toBeCalledTimes(1);
      expect(BedService.prototype.update).toBeCalledWith(bed, {
        isAvailable: true,
      });
      expect((res.data.data as Bed).isAvailable).toBeTruthy();
      spy.mockReset();
      done();
    });

    it('should show a bed by its id', async done => {
      expect.assertions(2);
      const res: AxiosResponse<BaseResponse<Bed>> = await axios.get(`/${bed}`);
      const item: Bed = res.data.data as Bed;

      expect(res.status).toBe(200);
      expect(item._id).toBe(bed);
      done();
    });
  });

  describe('blocking, unblocking and reservation of beds', () => {
    let bed: string;
    let blockedBed: string;

    beforeAll(async done => {
      bed = (await axios.post('/', createBed(hospital, { isAvailable: true })))
        .data.data._id!;
      blockedBed = (
        await axios.post('/', createBed(hospital, { isAvailable: false }))
      ).data.data._id!;
      created.push(bed);
      created.push(blockedBed);
      done();
    });

    it('should block an existing bed', async done => {
      expect.assertions(4);
      const spy: jest.SpyInstance = jest.spyOn(BedService.prototype, 'block');
      const res: AxiosResponse<BaseResponse<Bed>> = await axios.patch(
        `/${bed}/block`
      );

      expect(res.status).toBe(200);
      expect(BedService.prototype.block).toBeCalledTimes(1);
      expect(BedService.prototype.block).toBeCalledWith(bed);
      expect((res.data.data as Bed).isAvailable).toBeFalsy();
      spy.mockReset();
      done();
    });

    it('should fail to block an already blocked bed', async done => {
      expect.assertions(3);
      const spy: jest.SpyInstance = jest.spyOn(BedService.prototype, 'block');
      await expect(axios.patch(`/${blockedBed}/block`)).rejects.toThrow(
        'Request failed with status code 400'
      );

      expect(BedService.prototype.block).toBeCalledTimes(1);
      expect(BedService.prototype.block).toBeCalledWith(blockedBed);
      spy.mockReset();
      done();
    });

    it('should unblock an existing bed', async done => {
      expect.assertions(4);
      const spy: jest.SpyInstance = jest.spyOn(BedService.prototype, 'unblock');
      const res: AxiosResponse<BaseResponse<Bed>> = await axios.patch(
        `/${bed}/unblock`
      );

      expect(res.status).toBe(200);
      expect(BedService.prototype.unblock).toBeCalledTimes(1);
      expect(BedService.prototype.unblock).toBeCalledWith(bed);
      expect((res.data.data as Bed).isAvailable).toBeTruthy();
      spy.mockReset();
      done();
    });
  });
});
