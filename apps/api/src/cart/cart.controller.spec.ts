import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';

const TENANT_ID = 'demo-store';
const DEFAULT_PRODUCT_ID = 'arctic-breeze';

describe('CartController (e2e)', () => {
  let app: INestApplication;
  let createdCartId: string;
  let createdItemId: string;

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

  it('creates a new cart for the tenant', async () => {
    const response = await request(app.getHttpServer())
      .post(`/tenants/${TENANT_ID}/cart`)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        tenantId: TENANT_ID,
        items: [],
        subtotal: 0,
      }),
    );

    createdCartId = response.body.id;
  });

  it('adds an item to the cart from the catalog', async () => {
    const response = await request(app.getHttpServer())
      .post(`/tenants/${TENANT_ID}/cart/${createdCartId}/items`)
      .send({ productId: DEFAULT_PRODUCT_ID, quantity: 2 })
      .expect(201);

    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0]).toEqual(
      expect.objectContaining({ productId: DEFAULT_PRODUCT_ID, quantity: 2 }),
    );
    expect(response.body.subtotal).toBeGreaterThan(0);

    createdItemId = response.body.items[0].id;
  });

  it('updates the quantity of an existing cart item', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/tenants/${TENANT_ID}/cart/${createdCartId}/items/${createdItemId}`)
      .send({ quantity: 3 })
      .expect(200);

    expect(response.body.items[0]).toEqual(
      expect.objectContaining({ id: createdItemId, quantity: 3 }),
    );
  });

  it('removes an item from the cart', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/tenants/${TENANT_ID}/cart/${createdCartId}/items/${createdItemId}`)
      .expect(200);

    expect(response.body.items).toHaveLength(0);
    expect(response.body.subtotal).toBe(0);
  });

  it('returns a 404 for unknown carts', async () => {
    await request(app.getHttpServer())
      .get(`/tenants/${TENANT_ID}/cart/not-a-cart`)
      .expect(404);
  });
});
