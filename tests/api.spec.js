import { test, expect } from '@playwright/test';

test.describe('API Testing', () => {
  const baseUrl = 'http://localhost:3000/api';

  // Companies Count API Tests
  test('GET /api/companies/count returns total count', async ({ request }) => {
    const res = await request.get(`${baseUrl}/companies/count`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('total');
  });

  test('GET /api/companies/count with name filter', async ({ request }) => {
    const res = await request.get(`${baseUrl}/companies/count?name=Microsoft`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.total).toBeGreaterThanOrEqual(0);
  });

  // Top Paid Companies API Tests
  test('GET /api/companies/top-paid default limit', async ({ request }) => {
    const res = await request.get(`${baseUrl}/companies/top-paid`);
    expect(res.ok()).toBeTruthy();
    const companies = await res.json();
    expect(Array.isArray(companies)).toBeTruthy();
    expect(companies.length).toBeLessThanOrEqual(5);

    // Verify sorting
    for (let i = 1; i < companies.length; i++) {
      expect(companies[i-1].salaryBand.base >= companies[i].salaryBand.base).toBeTruthy();
    }
  });

  test('GET /api/companies/top-paid with custom limit', async ({ request }) => {
    const limit = 3;
    const res = await request.get(`${baseUrl}/companies/top-paid?limit=${limit}`);
    expect(res.ok()).toBeTruthy();
    const companies = await res.json();
    expect(companies.length).toBeLessThanOrEqual(limit);
  });

  // Companies by Skill API Tests
  test('GET /api/companies/by-skill/:skill', async ({ request }) => {
    const skill = 'JavaScript';
    const res = await request.get(`${baseUrl}/companies/by-skill/${skill}`);
    expect(res.ok()).toBeTruthy();
    const companies = await res.json();
    expect(Array.isArray(companies)).toBeTruthy();
    
    if (companies.length > 0) {
      companies.forEach(company => {
        expect(company.hiringCriteria.skills.some(s => 
          s.toLowerCase().includes(skill.toLowerCase())
        )).toBeTruthy();
      });
    }
  });

  // Companies by Location API Tests
  test('GET /api/companies/by-location/:location', async ({ request }) => {
    const location = 'Bangalore';
    const res = await request.get(`${baseUrl}/companies/by-location/${location}`);
    expect(res.ok()).toBeTruthy();
    const companies = await res.json();
    expect(Array.isArray(companies)).toBeTruthy();

    if (companies.length > 0) {
      companies.forEach(company => {
        expect(company.location.toLowerCase()).toContain(location.toLowerCase());
      });
    }
  });

  // Headcount Range API Tests
  test('GET /api/companies/headcount-range', async ({ request }) => {
    const min = 100;
    const max = 1000;
    const res = await request.get(`${baseUrl}/companies/headcount-range?min=${min}&max=${max}`);
    expect(res.ok()).toBeTruthy();
    const companies = await res.json();
    expect(Array.isArray(companies)).toBeTruthy();

    if (companies.length > 0) {
      companies.forEach(company => {
        expect(company.headcount).toBeGreaterThanOrEqual(min);
        expect(company.headcount).toBeLessThanOrEqual(max);
      });
    }
  });

  // Benefits API Tests
  test('GET /api/companies/benefit/:benefit existing benefit', async ({ request }) => {
    const benefit = 'Insurance';
    const res = await request.get(`${baseUrl}/companies/benefit/${benefit}`);
    expect(res.ok()).toBeTruthy();
    const companies = await res.json();
    expect(Array.isArray(companies)).toBeTruthy();

    if (companies.length > 0) {
      companies.forEach(company => {
        expect(company.benefits.some(b => 
          b.toLowerCase().includes(benefit.toLowerCase())
        )).toBeTruthy();
      });
    }
  });

  test('GET /api/companies/benefit/:benefit non-existing', async ({ request }) => {
    const res = await request.get(`${baseUrl}/companies/benefit/NonExistingBenefit123`);
    expect(res.ok()).toBeTruthy();
    const companies = await res.json();
    expect(Array.isArray(companies)).toBeTruthy();
    expect(companies.length).toBe(0);
  });
});
