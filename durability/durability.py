#!/usr/bin/env python

import matplotlib as mpl
mpl.use("pdf")
import seaborn as sns
from matplotlib import pylab as plt
from decimal import Decimal as D, getcontext

getcontext().prec = 100
N = 40
K = 32
F = .1

def binomial(n, k):
  if 0 <= k <= n:
    ntok = D(1)
    ktok = D(1)
    for t in xrange(1, min(k, n - k) + 1):
      ntok *= n
      ktok *= D(t)
      n -= D(1)
    return ntok // ktok
  else:
    return D(0)


def probdur(n, k, fail):
  n, k, fail = D(n), D(k), D(fail)
  sum = D(0)
  for i in xrange(n-k+1):
    i = D(i)
    sum += binomial(n, i) * fail**i * (1-fail)**(n-i)
  return sum


def nines(n, k, fail):
  if k > n:
    return 0
  val = str(probdur(n, k, fail))
  if not val.startswith("0."):
    return 0
  assert val.startswith("0."), val
  val = val[2:]
  counter = 0
  while True:
    if val[counter:counter+1] == "9":
      counter += 1
    else:
      break
  return counter

colors = sns.cubehelix_palette(
    8, dark=0, light=1, start=.5, rot=-.75, as_cmap=True)
ax = sns.heatmap(
    [[nines(n, k, F) for n in xrange(1,N+1)]
     for k in xrange(1,K+1)],
    xticklabels=[i if i % 4 == 0 else "" for i in xrange(1, N+1)],
    yticklabels=[i if i % 4 == 0 else "" for i in xrange(1, K+1)],
    cmap=colors,
    cbar_kws={"label": "9s of durability"})
ax.invert_yaxis()
plt.yticks(rotation=0)
plt.title("durability assuming uniform %d%% probability of node failure" % (
    int(F*100),))
plt.ylabel("k", rotation=0)
plt.xlabel("n")
plt.savefig("durability")

for k, n in ((2, 4), (4, 8), (8, 16), (16, 32), (32, 64)):
  print k, n, nines(n, k, F), "%0.20f" % probdur(n, k, F)
