import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';

const TENANT_ID = 'demo-store';

describe('CatalogController (e2e)', () => {
  let app: INestApplication;
  let createdProductId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('lists seeded catalog categories', async () => {
    const response = await request(app.getHttpServer())
      .get(`/tenants/${TENANT_ID}/catalog/categories`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toEqual(
      expect.objectContaining({ id: expect.any(String), name: expect.any(String) }),
    );
  });

  it('allows creating a new catalog category', async () => {
    const createResponse = await request(app.getHttpServer())
      .post(`/tenants/${TENANT_ID}/catalog/categories`)
      .send({ name: 'Seasonal Specials', description: 'Limited seasonal products.' })
      .expect(201);

    expect(createResponse.body).toEqual(
      expect.objectContaining({
        id: 'seasonal-specials',
        name: 'Seasonal Specials',
        description: 'Limited seasonal products.',
      }),
    );
  });

  it('creates a product bound to an existing category', async () => {
    const response = await request(app.getHttpServer())
      .post(`/tenants/${TENANT_ID}/catalog/products`)
      .send({
        name: 'Fjord Bath Crystals',
        description: 'Aromatic soak infused with mineral salts and botanicals.',
        price: 219,
        currency: 'NOK',
        categoryId: 'bath-and-body',
        imageLabel: 'Fjord Bath Crystals',
        badge: 'New',
        rating: 4.6,
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Fjord Bath Crystals',
        currency: 'NOK',
        categoryId: 'bath-and-body',
      }),
    );

    createdProductId = response.body.id;
  });

  it('lists catalog products including newly created entries', async () => {
    const response = await request(app.getHttpServer())
      .get(`/tenants/${TENANT_ID}/catalog/products`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: expect.any(String), name: expect.any(String) }),
      ]),
    );

    if (createdProductId) {
      expect(response.body.some((product: { id: string }) => product.id === createdProductId)).toBe(true);
    }
  });

  it('rejects products created with an unknown category', async () => {
    await request(app.getHttpServer())
      .post(`/tenants/${TENANT_ID}/catalog/products`)
      .send({
        name: 'Unknown Category Product',
        description: 'This request should fail due to missing category.',
        price: 99,
        currency: 'NOK',
        categoryId: 'not-a-category',
        imageLabel: 'Unknown Product',
      })
      .expect(404);
  });
});
