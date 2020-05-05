import { Connection } from '../../src/db/Connection';
import * as http from 'http';
import axios, { AxiosResponse } from 'axios';
import { createHospital } from '../helper';
import { BaseResponse } from '../../src/interfaces/http/BaseResponse';
import { Hospital } from '../../src/interfaces/models/Hospital';
import { HospitalRepository } from '../../src/db/repository/HospitalRepository';
import { HospitalService } from '../../src/services/HospitalService';
import { Server } from '../../src/server';

let httpServer: http.Server;

axios.defaults.baseURL = 'http://localhost:3000/v1/hospitals';

const created: string[] = [];

describe('hospitals', () => {
  beforeAll(async done => {
    await Connection.create();
    const s: Server = new Server();

    await s.init();

    s.app.set('port', '3000');
    httpServer = http.createServer(s.app);
    httpServer.listen(3000);
    done();
  });

  afterAll(async done => {
    const repo: HospitalRepository = new HospitalRepository();
    for (const id of created) {
      await repo.delete(id);
    }

    await Connection.destroy();
    await httpServer.close();
    done();
  });

  it('should create a hospital', async done => {
    expect.assertions(4);
    const res: AxiosResponse<BaseResponse<Hospital>> = await axios.post(
      '/',
      createHospital()
    );
    const item: Hospital = res.data.data as Hospital;

    expect(res.status).toBe(200);
    expect(item._id).toBeDefined();
    expect(item.createdAt).toBeDefined();
    expect(item.updatedAt).toBeDefined();

    created.push(item._id!);
    done();
  });

  it('should fail to create a hospital with a validation error', async done => {
    expect.assertions(2);
    const spy: jest.SpyInstance = jest.spyOn(
      HospitalService.prototype,
      'create'
    );
    await expect(axios.post('/', {})).rejects.toThrow(
      'Request failed with status code 422'
    );

    expect(HospitalService.prototype.create).not.toBeCalled();
    spy.mockReset();
    done();
  });

  it('should fail to show a hospital', async done => {
    expect.assertions(2);
    const spy: jest.SpyInstance = jest.spyOn(HospitalService.prototype, 'show');
    await expect(axios.get('/1ea980de8ce1be80e939a1b8')).rejects.toThrow(
      'Request failed with status code 404'
    );
    expect(HospitalService.prototype.show).toHaveBeenCalledTimes(1);
    spy.mockReset();
    done();
  });

  describe('existing hospital actions', () => {
    let hospital: string;
    const hospitalData: Partial<Hospital> = createHospital();

    beforeAll(async done => {
      hospital = (await axios.post('/', hospitalData)).data.data._id!;
      created.push(hospital);
      console.log(hospital);
      done();
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    it('should update a hospital', async done => {
      expect.assertions(4);
      const spy: jest.SpyInstance = jest.spyOn(
        HospitalService.prototype,
        'update'
      );
      const res: AxiosResponse<BaseResponse<
        Hospital
      >> = await axios.patch(`/${hospital}`, {
        ...hospitalData,
        name: 'Uniklinik',
      });
      console.log(res.data);
      expect(res.status).toBe(200);
      expect(HospitalService.prototype.update).toBeCalledTimes(1);
      expect(HospitalService.prototype.update).toBeCalledWith(hospital, {
        ...hospitalData,
        name: 'Uniklinik',
      });
      expect((res.data.data as Hospital).name).toBe('Uniklinik');
      spy.mockReset();
      done();
    });

    it('should show a hospital list with max 10 entries', async done => {
      expect.assertions(4);
      const spy: jest.SpyInstance = jest.spyOn(
        HospitalService.prototype,
        'index'
      );
      const res: AxiosResponse<BaseResponse<Hospital>> = await axios.get('/');

      expect(res.status).toBe(200);
      expect(HospitalService.prototype.index).toBeCalledTimes(1);
      expect(HospitalService.prototype.index).toBeCalledWith(null);
      expect((res.data.data as Hospital[]).length).toBeLessThanOrEqual(10);
      spy.mockReset();
      done();
    });

    it('should show a hospital list by city and postal code', async done => {
      expect.assertions(5);
      const spy: jest.SpyInstance = jest.spyOn(
        HospitalService.prototype,
        'index'
      );
      const res: AxiosResponse<BaseResponse<Hospital>> = await axios.get('/', {
        params: {
          city: 'Rostock',
          postalCode: '18059',
        },
      });

      expect(res.status).toBe(200);
      expect(HospitalService.prototype.index).toBeCalledTimes(1);
      expect(HospitalService.prototype.index).toBeCalledWith({
        city: 'Rostock',
        postalCode: '18059',
        limit: 10,
      });
      expect((res.data.data as Hospital[]).length).toBeLessThanOrEqual(10);
      expect((res.data.data as Hospital[]).length).toBeGreaterThanOrEqual(1);
      spy.mockReset();
      done();
    });

    it('should show a hospital list by lat and lng', async done => {
      expect.assertions(5);
      const spy: jest.SpyInstance = jest.spyOn(
        HospitalService.prototype,
        'index'
      );
      const res: AxiosResponse<BaseResponse<Hospital>> = await axios.get('/', {
        params: {
          lat: '54',
          lng: '12',
          distance: 20,
        },
      });

      expect(res.status).toBe(200);
      expect(HospitalService.prototype.index).toBeCalledTimes(1);
      expect(HospitalService.prototype.index).toBeCalledWith({
        lat: 54,
        lng: 12,
        distance: 20,
        limit: 10,
      });
      expect((res.data.data as Hospital[]).length).toBeLessThanOrEqual(10);
      expect((res.data.data as Hospital[]).length).toBeGreaterThanOrEqual(1);
      spy.mockReset();
      done();
    });

    it('should show a hospital list paginated', async done => {
      expect.assertions(5);
      const spy: jest.SpyInstance = jest.spyOn(
        HospitalService.prototype,
        'index'
      );
      const res: AxiosResponse<BaseResponse<Hospital>> = await axios.get('/', {
        params: {
          page: 1,
        },
      });

      expect(res.status).toBe(200);
      expect(HospitalService.prototype.index).toBeCalledTimes(1);
      expect(HospitalService.prototype.index).toBeCalledWith({
        page: 1,
        limit: 10,
      });
      expect((res.data.data as Hospital[]).length).toBeLessThanOrEqual(10);
      expect((res.data.data as Hospital[]).length).toBeGreaterThanOrEqual(1);
      spy.mockReset();
      done();
    });

    it('should show a hospital by its id', async done => {
      expect.assertions(2);
      const res: AxiosResponse<BaseResponse<Hospital>> = await axios.get(
        `/${hospital}`
      );
      const item: Hospital = res.data.data as Hospital;

      expect(res.status).toBe(200);
      expect(item._id).toBe(hospital);
      done();
    });
  });

  describe('existing delete actions', () => {
    let hospital: string;

    beforeAll(async done => {
      hospital = (await axios.post('/', createHospital())).data.data._id!;
      done();
    });

    it('should delete a hospital by its id', async done => {
      expect.assertions(1);
      const res: AxiosResponse<BaseResponse<Hospital>> = await axios.delete(
        `/${hospital}`
      );

      expect(res.status).toBe(200);
      done();
    });
  });
});
