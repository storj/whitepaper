#!/usr/bin/env python

import decimal, math

decimal.getcontext().prec = 20

def P(p, k, n):
  p, n, k = map(decimal.Decimal, (p, n, k))
  l = p*n
  return (-l).exp() * sum((l ** i)/math.factorial(i) for i in xrange(n-k+1))

for k, n in (
    (2, 4), (4, 8), (8, 16), (16, 32), (20, 40), (32, 64),
    (1, 1), (1, 2), (1, 3), (1, 10), (1, 16),
    (4, 6), (4, 12), (20, 30), (20, 50), (100, 150)):
  print "%d\t%d\t%s\t%0.015f" % (k, n, n/float(k), P(.1, k, n) * 100)
